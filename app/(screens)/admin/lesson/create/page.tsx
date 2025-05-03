"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

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
          <TooltipTrigger>
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

const CreateLesson = () => {
  const [markdown, setMarkdown] = useState<string>("");
  const [isFullPreview, setFullPreview] = useState<boolean>(false);

  const [openLessonInfoEditor, setOpenLessonInfoEditor] = useState(false);
  const [openAddModuleDialog, setOpenAddModuleDialog] = useState(false);
  const [openEditModuleDialog, setOpenEditModuleDialog] = useState(false);

  return (
    <div className="w-full h-full p-6 relative">
      <TooltipProvider>
        <div className="h-14 my-2 flex flex-row gap-4">
          <div className="flex-1">
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
                onClick={() => {}}
              />

              <EditorMenuButton
                tooltip="Next Module"
                icon={<ChevronRight className="text-black" size={100} />}
                onClick={() => {}}
              />
            </div>
            <Button className="w-1/3 flex flex-row justify-between h-full bg-transparent shadow-lg border-2 border-white rounded-lg cursor-pointer hover:bg-white">
              <span className="text-black">Lesson Modules</span>
              <ChevronDown className="text-black" />
            </Button>
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
          </div>
        </div>

        <div
          className={`h-[90%] transition-all grid ${
            !isFullPreview ? "grid-cols-1 md:grid-cols-2" : ""
          } gap-8`}
        >
          {!isFullPreview && (
            <Card className="h-full col-span-1 transition-all">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Markdown Input</h2>
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
                children={markdown || "Nothing to preview..."}
                key={markdown}
              />
            </CardContent>
          </Card>
        </div>

        <LessonInfoDialog
          isOpen={openLessonInfoEditor}
          onClose={() => setOpenLessonInfoEditor(false)}
          onSubmit={(data) => console.log("Lesson Info:", data)}
        />
        <ModuleDialog
          isOpen={openAddModuleDialog}
          onClose={() => setOpenAddModuleDialog(false)}
          onSubmit={(data) => console.log("Create Module:", data)}
        />
        <ModuleDialog
          isOpen={openEditModuleDialog}
          onClose={() => setOpenEditModuleDialog(false)}
          onSubmit={(data) => console.log("Edit Module:", data)}
          defaultValues={{ moduleName: "", moduleDescription: "" }}
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
