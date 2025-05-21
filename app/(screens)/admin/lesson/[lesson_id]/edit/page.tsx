"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkParse from "remark-parse";

import { createContext, useContext } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Cog,
  Pencil,
  Plus,
  Save,
} from "lucide-react";

import { LearningResourceModule } from "@/types/type.lessons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import LessonInfoDialog from "./components/LessonInfoDialog";
import ModuleDialog from "./components/ModuleDialog";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import { useLearningResourceStore } from "@/app/store/store.lr";
import { authClient } from "@/app/lib/auth-client";
import { learningResource } from "@/db/schema/learning-resources";
import { useModuleStore } from "@/app/store/store.modules";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import remarkBaybayin from "@/app/lib/remark-baybayin";

type LessonEditorContextType = {
  lessonId?: string;
  lessonName?: string;
  lessonDescription?: string;
  isLessonVisible?: boolean;

  modules?: LearningResourceModule[];
  currentModuleIndex?: number;

  setLessonName?: (name: string) => void;
  setLessonDescription?: (description: string) => void;
  setIsLessonVisible?: (isVisible: boolean) => void;
  setCurrentModuleIndex?: (index: number) => void;
};

type EditorMenuButtonProps = {
  icon: React.ReactNode;
  tooltip?: string;
  disabled?: boolean;
  onClick: () => void;
};

const LessonEditorContext = createContext<LessonEditorContextType | null>(null);

const useLessonEditor = () => {
  const ctx = useContext(LessonEditorContext);
  if (!ctx)
    throw new Error("useEditorContext must be used within EditorProvider");
  return ctx;
};

const EditorLoading = () => {
  return (
    <div className="absolute h-full w-full backdrop-blur-lg grid place-items-center z-50">
      <LoadingSpinner />
    </div>
  );
};

const EditorMenuButton = (props: EditorMenuButtonProps) => {
  return (
    <>
      {props.tooltip ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="border-0 bg-white shadow-lg h-full aspect-square p-2 rounded-lg grid place-items-center cursor-pointer hover:bg-white"
              onClick={props.onClick}
            >
              {props.icon}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">{props.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        <Button
          className="border-0 bg-white shadow-lg h-full aspect-square p-2 rounded-lg grid place-items-center cursor-pointer hover:bg-white"
          onClick={props.onClick}
        >
          {props.icon}
        </Button>
      )}
    </>
  );
};

export function exportMarkdownFile(markdown: string, filename = "lesson.md") {
  const file = new Blob([markdown], { type: "text/markdown" });
  const uri = URL.createObjectURL(file);
  return { file, uri, filename };
}

const CreateLesson = () => {
  const router = useRouter();
  const params = useParams();

  const lessonStore = useLearningResourceStore();
  const moduleStore = useModuleStore();

  const [userId, setUserId] = useState<string | undefined>(undefined);

  const [initialMarkdown, setInitialMarkdown] = useState<string>("");
  const [markdown, setMarkdown] = useState<string>("");
  const [isFullPreview, setFullPreview] = useState<boolean>(false);
  const [unsavedChangeShown, setUnsavedChangeShown] = useState(false);

  const [openLessonInfoEditor, setOpenLessonInfoEditor] = useState(false);
  const [openAddModuleDialog, setOpenAddModuleDialog] = useState(false);
  const [openEditModuleDialog, setOpenEditModuleDialog] = useState(false);

  const [lessonResourceDetails, setResourceDetails] = useState<any>(undefined);

  const [modules, setModules] = useState<any[]>([]);
  const [currentModuleIndex, setCurrentModuleIndex] = useState<number>(0);
  const [currentModule, setCurrentModule] = useState<any>(null);

  useEffect(() => {
    loadLearningResourceInformation();
    retrieveUserInformation();
  }, []);

  useEffect(() => {
    if (params.lesson_id == "new" && !openLessonInfoEditor) {
      setOpenLessonInfoEditor(true);
      toast.info("Please fill in the lesson information first");
    }
  }, [openLessonInfoEditor]);

  useEffect(() => {
    if (
      !openAddModuleDialog &&
      moduleStore.modules &&
      moduleStore.modules.length <= 0 &&
      moduleStore.status == "Loaded"
    ) {
      setOpenAddModuleDialog(true);
      toast.info("Please create your own module first");
    }
  }, [openAddModuleDialog, modules, moduleStore.status]);

  useEffect(() => {
    if (initialMarkdown != markdown && !unsavedChangeShown) {
      setUnsavedChangeShown(true);
      toast.warning("Unsaved changes detected", {
        onAutoClose: () => {
          setUnsavedChangeShown(false);
        },
        onDismiss: () => {
          setUnsavedChangeShown(false);
        },
      });
      console.log("Unsaved changes detected");
    }
  }, [markdown]);

  const loadLearningResourceInformation = async () => {
    if (params.lesson_id == "new") return;

    const lessonId = params.lesson_id as string;
    const lesson = await lessonStore.getLesson(lessonId);
    if (lesson.error) {
      toast.error(lesson.error);
      return;
    }

    setResourceDetails(lesson.learning_resource);
    fetchModules();
  };

  useEffect(() => {
    const updatedModules = moduleStore.modules || [];
    setModules(updatedModules);

    if (updatedModules.length > 0) {
      // Always select and load the first module after modules load
      setCurrentModuleIndex(0);
      setCurrentModule(updatedModules[0]);
      loadMarkdown(updatedModules[0]);
    } else {
      setCurrentModuleIndex(0);
      setCurrentModule(null);
      setMarkdown("");
      setInitialMarkdown("");
    }
  }, [moduleStore.modules]);

  useEffect(() => {
    if (currentModuleIndex >= 0) {
      const lessonModule = modules[currentModuleIndex];
      if (lessonModule) {
        setCurrentModule(lessonModule);
        console.log(lessonModule, lessonModule.file)
        if (lessonModule.file && lessonModule.file.url) {
          fetch(lessonModule.file.url).then(async (res) => {
            if (res.ok) {
              const text = await res.text();
              setMarkdown(text);
              setInitialMarkdown(text);
            } else {
              throw new Error("Failed to fetch file");
            }
          });
        }
      } else {
        setCurrentModule(null);
        setMarkdown("");
        setInitialMarkdown("");
      }
    }
  }, [currentModuleIndex]);

  const handleLessonInfoSubmit = async (data: any) => {
    if (params.lesson_id != "new") {
      const lessonUpdated = await lessonStore.updateLesson({
        id: params.lesson_id as string,
        title: data.lessonName,
        description: data.lessonDescription,
        is_visible: data.isLessonVisible,
      });

      setResourceDetails({
        id: params.lesson_id,
        title: data.lessonName,
        description: data.lessonDescription,
        is_visible: data.isLessonVisible,
      });

      setOpenLessonInfoEditor(false);
    } else {
      const lessonCreated = await lessonStore.createLesson(
        data.lessonName,
        data.lessonDescription,
        userId as string,
        data.isLessonVisible
      );

      if (lessonCreated.error) {
        toast.error(lessonCreated.error);
        return;
      }
      router.push(`/admin/lesson/${lessonCreated.id}/edit`);
    }
  };

  const retrieveUserInformation = async () => {
    const session = await authClient.getSession();
    if (!session.data) {
      toast.error("User not authenticated");
      return;
    }
    setUserId(session.data.user.id);
  };

  const fetchModules = async () => {
    if (!params.lesson_id || params.lesson_id === "new") return;
    await moduleStore.getModules(params.lesson_id as string);
  };

  const loadMarkdown = async (module: any) => {
    if (!module || !module.module_id) {
      setMarkdown("");
      setInitialMarkdown("");
      return;
    }
  };

  useEffect(() => {
    if (
      modules.length > 0 &&
      currentModuleIndex >= 0 &&
      currentModuleIndex < modules.length
    ) {
      setCurrentModule(modules[currentModuleIndex]);
      loadMarkdown(modules[currentModuleIndex]);
    }
  }, [currentModuleIndex, modules]);

  const handleCreateModule = async (data: {
    moduleName: string;
    moduleDescription: string;
    file?: File;
  }) => {
    if (!lessonResourceDetails?.id) {
      toast.error("Lesson not loaded");
      return;
    }
    await moduleStore.createModule({
      resourceId: lessonResourceDetails.id,
      module_title: data.moduleName,
      module_description: data.moduleDescription,
      file: data.file,
    });
    await fetchModules();
    toast.success("Module created");
  };

  const handleUpdateModuleContent = async (data: {
    moduleName: string;
    moduleDescription: string;
  }) => {
    if (!lessonResourceDetails?.id || !currentModule?.id) {
      toast.error("Module not selected");
      return;
    }
    setOpenEditModuleDialog(false);
    await moduleStore.updateModuleContent({
      resourceId: lessonResourceDetails.id,
      moduleId: currentModule.id,
      module_title: data.moduleName,
      module_description: data.moduleDescription,
    });
    await fetchModules();
    toast.success("Module updated");
  };

  const handleUpdateModuleFile = async (file: File) => {
    if (!lessonResourceDetails?.id || !currentModule?.id) {
      toast.error("Module or file not selected");
      return;
    }
    await moduleStore.updateModuleFile({
      resourceId: lessonResourceDetails.id,
      moduleId: currentModule.id,
      file,
      existingFileId: currentModule.module_id ?? null,
    });
    await fetchModules();
    toast.success("Module file updated");
  };

  const handleDeleteModule = async () => {
    if (!lessonResourceDetails?.id || !currentModule?.id) {
      toast.error("Module not selected");
      return;
    }
    await moduleStore.deleteModule({
      resourceId: lessonResourceDetails.id,
      moduleId: currentModule.id,
    });
    await fetchModules();
    setCurrentModuleIndex(0);
    toast.success("Module deleted");
  };

  const uploadMarkdown = async () => {
    if (!currentModule?.id) {
      toast.error("No module selected");
      return;
    }
    const markdownFile = new File(
      [markdown],
      `${lessonResourceDetails?.title}_${Date.now()}.md`,
      { type: "text/markdown" }
    );
    await handleUpdateModuleFile(markdownFile);
  };

  const updateMarkdown = async () => {
    await uploadMarkdown();
    setInitialMarkdown(markdown);
  };

  return (
    <div className="w-full h-full p-6 relative">
      {moduleStore.status == "Loading" && (
        <div className="absolute top-0 left-0 w-full h-full backdrop-blur-xl bg-black/20 z-50">
          <LoadingSpinner loadingText="Loading Module..." />
        </div>
      )}
      <TooltipProvider>
        <div className="h-14 my-2 flex flex-row gap-4">
          <div className="flex-1 flex flex-row gap-2">
            <EditorMenuButton
              icon={<ChevronLeft className="text-black" size={100} />}
              onClick={() => router.back()}
            />
            <EditorMenuButton
              icon={<Cog className="text-black" size={100} />}
              onClick={() => setOpenLessonInfoEditor(true)}
            />
          </div>

          <div className="flex flex-row gap-4 justify-end flex-1">
            <div className="flex flex-row gap-2">
              <EditorMenuButton
                tooltip="Previous Module"
                icon={<ChevronLeft className="text-black" size={100} />}
                onClick={() => {
                  if (currentModuleIndex > 0)
                    setCurrentModuleIndex(currentModuleIndex - 1);
                }}
              />

              <EditorMenuButton
                tooltip="Next Module"
                icon={<ChevronRight className="text-black" size={100} />}
                onClick={() => {
                  if (currentModuleIndex < modules.length - 1)
                    setCurrentModuleIndex(currentModuleIndex + 1);
                }}
              />
            </div>
            {/* Dropdown menu for lesson modules */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-1/2 flex flex-row justify-between h-full bg-transparent shadow-lg border-2 border-white rounded-lg cursor-pointer hover:bg-white">
                  <span className="text-black">
                    {modules[currentModuleIndex]?.module_name ||
                      "Lesson Modules"}
                  </span>
                  <ChevronDown className="text-black" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {modules.length === 0 ? (
                  <DropdownMenuItem disabled>No modules</DropdownMenuItem>
                ) : (
                  modules.map((mod, idx) => (
                    <DropdownMenuItem
                      key={mod.id || idx}
                      onClick={() => setCurrentModuleIndex(idx)}
                      className={idx === currentModuleIndex ? "font-bold" : ""}
                    >
                      {  `${idx + 1}. ${mod.module_name}` || `Module ${idx + 1}`}
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-row gap-2">
            <EditorMenuButton
              tooltip="Add Module"
              icon={<Plus className="text-black" size={100} />}
              onClick={() => setOpenAddModuleDialog(true)}
            />
            <EditorMenuButton
              tooltip="Edit Module Information"
              icon={<Pencil className="text-black" size={100} />}
              onClick={() => setOpenEditModuleDialog(true)}
            />
            <EditorMenuButton
              tooltip="Save Module"
              icon={<Save className="text-black" size={100} />}
              onClick={updateMarkdown}
            />
          </div>
        </div>

        <div
          className={`h-[90%] transition-all grid ${
            !isFullPreview ? "grid-cols-1 md:grid-cols-2" : ""
          } gap-8`}
        >
          {!isFullPreview && (
            <Card className="h-full col-span-1 transition-all relative">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Markdown Input</h2>
                {/* Small upload button in the corner */}
                <div className="absolute top-4 right-4 flex flex-row gap-2 z-10">
                  <input
                    id="upload-md"
                    type="file"
                    accept=".md,text/markdown"
                    style={{ display: "none" }}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const text = await file.text();
                        setMarkdown(text);
                      }
                    }}
                  />
                  <label htmlFor="upload-md">
                    <Button
                      variant="outline"
                      size="icon"
                      className="p-2"
                      asChild
                      title="Upload Markdown"
                    >
                      <span>
                        <Plus className="w-4 h-4" />
                      </span>
                    </Button>
                  </label>
                </div>
              </CardHeader>
              <CardContent className="h-full">
                <textarea
                  className="w-full h-full p-4 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write your lesson here..."
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                />
              </CardContent>
            </Card>
          )}
          <Card className="w-full h-full relative col-span-1 transition-all">
            <div
              onClick={() => setFullPreview((v) => !v)}
              className="w-14 aspect-square rounded-full -left-7 top-1/2 -translate-y-1/2 absolute bg-red-50 shadow-lg grid place-items-center"
            >
              {!isFullPreview ? <ChevronLeft /> : <ChevronRight />}
            </div>
            <CardHeader>
              <h2 className="text-2xl font-semibold">Preview</h2>
            </CardHeader>
            <CardContent className="prose max-w-none relative">
              <ReactMarkdown
                remarkPlugins={[remarkParse, remarkBaybayin]}
                children={markdown || "Nothing to preview..."}
                key={markdown}
              />
            </CardContent>
          </Card>
        </div>

        <LessonInfoDialog
          isOpen={openLessonInfoEditor}
          onClose={() => setOpenLessonInfoEditor(false)}
          onSubmit={handleLessonInfoSubmit}
          defaultValues={
            lessonResourceDetails
              ? {
                  lessonName: lessonResourceDetails.title ?? "",
                  lessonDescription: lessonResourceDetails.description ?? "",
                  isLessonVisible: lessonResourceDetails.is_visible ?? false,
                }
              : undefined
          }
        />
        <ModuleDialog
          isOpen={openAddModuleDialog}
          onClose={() => setOpenAddModuleDialog(false)}
          onSubmit={handleCreateModule}
        />
        <ModuleDialog
          isOpen={openEditModuleDialog}
          onClose={() => setOpenEditModuleDialog(false)}
          onSubmit={handleUpdateModuleContent}
          defaultValues={{
            moduleName: modules[currentModuleIndex]?.module_name ?? "",
            moduleDescription: modules[currentModuleIndex]?.module_description ?? "",
          }}
        />
      </TooltipProvider>
    </div>
  );
};

const CreateLessonMain = () => {
  return (
    <LessonEditorContext.Provider value={{}}>
      <CreateLesson />
    </LessonEditorContext.Provider>
  );
};

export default CreateLessonMain;
