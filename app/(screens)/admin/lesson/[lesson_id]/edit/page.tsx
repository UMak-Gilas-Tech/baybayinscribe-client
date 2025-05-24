"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkParse from "remark-parse";

import { createContext } from "react";
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
import { useModuleStore } from "@/app/store/store.modules";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import remarkBaybayin from "@/app/lib/remark-baybayin";
import type { LearningResource } from "@/types/type.lessons";

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

// Local type for modules with file
type ModuleWithFile = LearningResourceModule & { file?: { url?: string } };

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
  const [lessonResourceDetails, setResourceDetails] = useState<
    LearningResource | undefined
  >(undefined);
  const [modules, setModules] = useState<ModuleWithFile[]>([]);
  const [currentModuleIndex, setCurrentModuleIndex] = useState<number>(0);
  const [currentModule, setCurrentModule] = useState<ModuleWithFile | null>(
    null
  );

  const fetchModules = React.useCallback(async () => {
    if (!params.lesson_id || params.lesson_id === "new") return;
    await moduleStore.getModules(params.lesson_id as string);
  }, [params.lesson_id, moduleStore]);

  const loadLearningResourceInformation = React.useCallback(async () => {
    if (params.lesson_id == "new") return;
    const lessonId = params.lesson_id as string;
    const lesson = await lessonStore.getLesson(lessonId);
    if (!lesson || (Array.isArray(lesson) && lesson.length === 0)) {
      toast.error("Lesson not found");
      return;
    }
    const lessonObj = Array.isArray(lesson) ? lesson[0] : lesson;
    setResourceDetails(lessonObj as LearningResource);
    fetchModules();
  }, [params.lesson_id, lessonStore, fetchModules]);

  useEffect(() => {
    loadLearningResourceInformation();
    retrieveUserInformation();
  }, [loadLearningResourceInformation]);

  useEffect(() => {
    if (params.lesson_id == "new" && !openLessonInfoEditor) {
      setOpenLessonInfoEditor(true);
      toast.info("Please fill in the lesson information first");
    }
  }, [openLessonInfoEditor, params.lesson_id]);

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
  }, [openAddModuleDialog, moduleStore.modules, moduleStore.status]);

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
  }, [initialMarkdown, markdown, unsavedChangeShown]);

  useEffect(() => {
    const updatedModules = (moduleStore.modules || []) as ModuleWithFile[];
    setModules(updatedModules);
    if (updatedModules.length > 0) {
      setCurrentModuleIndex(0);
      setCurrentModule(updatedModules[0]);
      if (updatedModules[0]?.file?.url) {
        fetch(updatedModules[0].file.url).then(async (res) => {
          if (res.ok) {
            const text = await res.text();
            setMarkdown(text);
            setInitialMarkdown(text);
          } else {
            setMarkdown("");
            setInitialMarkdown("");
          }
        });
      } else {
        setMarkdown("");
        setInitialMarkdown("");
      }
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
        if (lessonModule.file?.url) {
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
  }, [currentModuleIndex, modules]);

  const handleLessonInfoSubmit = async (data: {
    lessonName: string;
    lessonDescription: string;
    isLessonVisible: boolean;
  }) => {
    if (params.lesson_id != "new") {
      await lessonStore.updateLesson({
        id: params.lesson_id as string,
        title: data.lessonName,
        description: data.lessonDescription,
        is_visible: data.isLessonVisible,
      });
      setResourceDetails({
        id: params.lesson_id as string,
        title: data.lessonName,
        description: data.lessonDescription,
        is_visible: data.isLessonVisible,
        created_by: userId || "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setOpenLessonInfoEditor(false);
    } else {
      const lessonCreated = await lessonStore.createLesson(
        data.lessonName,
        data.lessonDescription,
        userId as string,
        data.isLessonVisible
      );
      if (typeof lessonCreated === "object" && "error" in lessonCreated) {
        toast.error((lessonCreated as Record<string, unknown>).error as string);
        return;
      }
      router.push(
        `/admin/lesson/${(lessonCreated as LearningResource).id}/edit`
      );
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

  const loadMarkdown = async (module: ModuleWithFile) => {
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
      existingFileId: currentModule.module_id || undefined,
    });
    await fetchModules();
    toast.success("Module file updated");
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
      {moduleStore.status === "Loading" && (
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-1/2 flex flex-row justify-between h-full bg-transparent shadow-lg border-2 border-white rounded-lg cursor-pointer hover:bg-white">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-black truncate">
                        {modules[currentModuleIndex]?.module_name ||
                          "Lesson Modules"}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>
                        {modules[currentModuleIndex]?.module_name ||
                          "Lesson Modules"}
                      </span>
                    </TooltipContent>
                  </Tooltip>
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
                      className={`truncate w-full ${
                        idx === currentModuleIndex ? "font-bold" : ""
                      }`}
                    >
                      {`${idx + 1}. ${mod.module_name}` || `Module ${idx + 1}`}
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
                key={markdown}
              >
                {markdown || "Nothing to preview..."}
              </ReactMarkdown>
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
                  isLessonVisible:
                    Boolean(lessonResourceDetails.is_visible) ?? false,
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
            moduleDescription:
              modules[currentModuleIndex]?.module_description ?? "",
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
