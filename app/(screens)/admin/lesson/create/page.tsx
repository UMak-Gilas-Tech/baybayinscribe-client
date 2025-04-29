"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Cog } from "lucide-react";
import { Button } from "@/components/ui/button";

type EditorMenuButtonProps = {
  icon: React.ReactNode;
  onClick: () => void;
};

const EditorMenuButton = (props: EditorMenuButtonProps) => {
  return (
    <Button
      className="border-0 bg-white shadow-lg h-full aspect-square p-2 rounded-lg grid place-items-center cursor-pointer hover:bg-white"
      onClick={props.onClick}
    >
      {props.icon}
    </Button>
  );
};

const CreateLesson = () => {
  const [markdown, setMarkdown] = useState<string>("");
  const [isFullPreview, setFullPreview] = useState<boolean>(false);

  return (
    <div className="w-full h-full p-6">
      <div className="h-14 my-2">
        <EditorMenuButton
          icon={<Cog className="text-black" size={100} />}
          onClick={() => {}}
        />
      </div>
      <div
        className={`h-full grid ${
          !isFullPreview ? "grid-cols-1 md:grid-cols-2" : ""
        } gap-8`}
      >
        {!isFullPreview && (
          <Card className="h-full col-span-1">
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
        <Card className="w-full h-full relative col-span-1">
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
    </div>
  );
};

export default CreateLesson;
