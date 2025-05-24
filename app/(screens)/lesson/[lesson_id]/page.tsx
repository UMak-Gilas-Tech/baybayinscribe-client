"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useLessonContext } from "../LessonContext";
import { CheckCircle2, Lock, FileText } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type FileType = {
  id: string;
  name: string;
  url: string;
  type: string;
};

function ProgressBar({ value, max }: { value: number; max: number }) {
  const percent = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-6">
      <div
        className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

function LessonContent() {
  const { lesson, status, error } = useLessonContext();
  const router = useRouter();

  if (status === "Loading") {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <Skeleton className="h-10 w-2/3 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-2" />
        <Skeleton className="h-24 w-full mb-8" />
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (status === "Error" || !lesson) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-semibold mb-2">Lesson Not Found</h2>
        <p className="text-muted-foreground">
          {error || "The lesson you are looking for does not exist."}
        </p>
      </div>
    );
  }

  const modules = (lesson.learning_resource_module || [])
    .slice()
    .sort(
      (a, b) =>
        new Date((a).createdAt).getTime() -
        new Date((b).createdAt).getTime()
    );
  const completedCount = modules.filter((m) => m.is_finished).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-slate-100 pb-20">
      <div className="sticky top-0 z-10 bg-gradient-to-b from-white/95 to-white/60 backdrop-blur-md border-b border-muted/40 mb-8">
        <div className="max-w-4xl mx-auto px-4 pt-8">
          <Card className="shadow-lg border border-muted/30 bg-white/90">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
                    {lesson.learning_resource.title}
                    {lesson.is_visible ? (
                      <Badge className="bg-green-500 text-white px-2 py-1 rounded-md text-xs">
                        Public
                      </Badge>
                    ) : (
                      <Badge className="bg-orange-400 text-white px-2 py-1 rounded-md text-xs">
                        Private
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-2 text-lg text-muted-foreground">
                    {lesson.learning_resource.description ??
                      "No description available."}
                  </CardDescription>
                </div>
                <div className="flex flex-col md:items-end gap-1">
                  <span className="text-xs text-muted-foreground">
                    Updated{" "}
                    {new Date(
                      lesson.learning_resource.createdAt
                    ).toLocaleDateString()}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Created by{" "}
                    <span className="font-medium text-foreground">
                      {lesson.learning_resource.created_by.name || "Unknown"}
                    </span>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Created at{" "}
                    <span className="font-medium text-foreground">
                      {new Date(
                        lesson.learning_resource.createdAt
                      ).toLocaleDateString()}
                    </span>
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Separator className="my-4" />
              <div className="flex items-center gap-3 mb-3">
                <span className="font-semibold text-sm text-muted-foreground">
                  Progress:
                </span>
                <span className="font-semibold text-foreground text-sm">
                  {completedCount}/{modules.length} modules completed.{" "}
                  {completedCount == modules.length
                    ? "Congratulations, you completed the course!"
                    : ""}
                </span>
              </div>
              <ProgressBar value={completedCount} max={modules.length} />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-2 mt-2">
          <h2 className="text-2xl font-bold">Modules</h2>
          <span className="text-muted-foreground text-sm">
            ({modules.length})
          </span>
        </div>
        <Separator className="mb-6" />
        <TooltipProvider>
          <div
            className={cn(
              "grid gap-8",
              modules.length > 1 ? "md:grid-cols-2" : ""
            )}
          >
            {modules.length === 0 && (
              <div className="text-muted-foreground text-center col-span-2 py-8">
                No modules yet for this lesson.
              </div>
            )}
            {(() => {
              let firstUnfinishedFound = false;
              return modules.map((mod: {
                module_id: string;
                module_name: string;
                module_description: string;
                file?: FileType | null;
                is_finished?: boolean;
              }) => {
                let canView = false;
                if (!mod.is_finished && !firstUnfinishedFound) {
                  canView = true;
                  firstUnfinishedFound = true;
                }
                if (mod.is_finished) {
                  canView = true;
                }
                return (
                  <Card
                    key={mod.module_id}
                    className={cn(
                      "transition-all border border-muted/30 shadow-md hover:shadow-2xl bg-white/95 relative group hover:-translate-y-1 hover:scale-[1.02] duration-200",
                      !canView && "opacity-60"
                    )}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="rounded-full bg-muted p-2">
                              {mod.is_finished ? (
                                <CheckCircle2
                                  className="text-green-500"
                                  size={24}
                                />
                              ) : canView ? (
                                <FileText className="text-blue-500" size={24} />
                              ) : (
                                <Lock className="text-gray-400" size={24} />
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {mod.is_finished
                              ? "Module completed"
                              : canView
                              ? "Module available"
                              : "Locked until previous modules are completed"}
                          </TooltipContent>
                        </Tooltip>
                        <CardTitle className="text-lg font-semibold flex-1">
                          {mod.module_name}
                        </CardTitle>
                        {mod.file && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge
                                variant="outline"
                                className="ml-auto flex items-center gap-1"
                              >
                                <FileText size={14} />
                                File
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>{mod.file.name}</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      <CardDescription className="mt-2 text-sm text-muted-foreground">
                        {mod.module_description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {mod.file ? (
                        canView ? (
                          <Button
                            variant="default"
                            size="sm"
                            className="mt-4 w-full group-hover:scale-105 transition-transform font-semibold"
                            onClick={() =>
                              router.push(
                                `${lesson.learning_resource.id}/${mod.module_id}/view`
                              )
                            }
                          >
                            View Module
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-4 w-full"
                            disabled
                          >
                            <Lock className="mr-2 h-4 w-4" />
                            Complete previous modules to unlock
                          </Button>
                        )
                      ) : (
                        <span className="text-xs text-muted-foreground block mt-4">
                          No file attached
                        </span>
                      )}
                    </CardContent>
                    {mod.is_finished && (
                      <span className="absolute top-3 right-3 text-green-500 text-xs font-semibold flex items-center gap-1">
                        <CheckCircle2 size={16} /> Completed
                      </span>
                    )}
                  </Card>
                );
              });
            })()}
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
}

export default function LessonPage() {
  return <LessonContent />;
}
