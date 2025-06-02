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
import { CheckCircle2, Lock, FileText, ChevronLeft, ChevronDown, ChevronUp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

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
  const [navigating, setNavigating] = React.useState(false);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = React.useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = React.useState(false);
  const { lesson, status, error } = useLessonContext();
  const router = useRouter();

  // Handle scroll to collapse/expand header
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsHeaderCollapsed(scrollY > 150);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (status === "Loading" || status == "Idle") {
    // Loading skeleton UI
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-slate-100 pb-20">
        <div className="sticky top-0 z-10 bg-gradient-to-b from-white/95 to-white/60 backdrop-blur-md border-b border-muted/40 mb-8">
          <div className="max-w-4xl mx-auto px-4 pt-8">
            <div className="shadow-lg border border-muted/30 bg-white/90 rounded-xl">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <Skeleton className="h-10 w-64 mb-2" />
                    <Skeleton className="h-6 w-40 mb-2" />
                  </div>
                  <div className="flex flex-col md:items-end gap-1">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </div>
                <Skeleton className="h-1 w-full my-6" />
                <div className="flex items-center gap-3 mb-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-3 w-full mb-6" />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-2 mt-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-5 w-10" />
          </div>
          <Skeleton className="h-1 w-full mb-6" />
          <div className="grid gap-8 md:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="bg-white/95 rounded-xl border border-muted/30 shadow-md p-6 flex flex-col gap-3"
              >
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
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
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  const completedCount = modules.filter((m) => m.is_finished).length;

  // Check if description is long (more than 150 characters)
  const isDescriptionLong = (lesson.learning_resource.description?.length || 0) > 150;
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-slate-100 pb-20">
      <div className={cn(
        "sticky top-0 z-10 bg-gradient-to-b from-white/95 to-white/60 backdrop-blur-md border-b border-muted/40 mb-8 transition-all duration-300",
        isHeaderCollapsed && "py-2"
      )}>
        <div className="max-w-4xl mx-auto px-4 pt-4 md:pt-8">
          {/* Back button */}
          <div className="mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2 hover:bg-white/50"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className={cn("transition-all", isHeaderCollapsed && "hidden md:inline")}>
                Back
              </span>
            </Button>
          </div>
          
          <Card className={cn(
            "shadow-lg border border-muted/30 bg-white/90 transition-all duration-300",
            isHeaderCollapsed && "shadow-md"
          )}>
            <CardHeader className={cn("transition-all duration-300", isHeaderCollapsed && "pb-3")}>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <CardTitle className={cn(
                    "font-extrabold tracking-tight flex items-center gap-3 transition-all duration-300",
                    isHeaderCollapsed ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl"
                  )}>
                    <span className="truncate">{lesson.learning_resource.title}</span>
                  </CardTitle>
                  
                  {/* Description with expand/collapse */}
                  {lesson.learning_resource.description && (
                    <div className={cn("mt-2 transition-all duration-300", isHeaderCollapsed && "hidden md:block")}>
                      <CardDescription className="text-base md:text-lg text-muted-foreground leading-relaxed">
                        {isDescriptionLong && !isDescriptionExpanded 
                          ? `${lesson.learning_resource.description.substring(0, 150)}...`
                          : lesson.learning_resource.description || "No description available."
                        }
                      </CardDescription>
                      
                      {isDescriptionLong && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                          className="mt-2 p-0 h-auto text-sm text-blue-600 hover:text-blue-800 hover:bg-transparent"
                        >
                          {isDescriptionExpanded ? (
                            <>
                              <ChevronUp className="h-4 w-4 mr-1" />
                              Show less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4 mr-1" />
                              Show more
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Metadata - responsive layout */}
                <div className={cn(
                  "flex flex-col gap-1 transition-all duration-300",
                  isHeaderCollapsed ? "md:items-end text-xs" : "md:items-end text-xs md:text-sm"
                )}>
                  <span className="text-muted-foreground whitespace-nowrap">
                    Updated{" "}
                    {new Date(lesson.learning_resource.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-muted-foreground">
                    Created by{" "}
                    <span className="font-medium text-foreground">
                      {lesson.learning_resource.created_by
                        ? (lesson.learning_resource.created_by as unknown as Record<string, string>).name
                        : "Unknown"}
                    </span>
                  </span>
                  <span className="text-muted-foreground whitespace-nowrap">
                    Created{" "}
                    <span className="font-medium text-foreground">
                      {new Date(lesson.learning_resource.createdAt).toLocaleDateString()}
                    </span>
                  </span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className={cn("transition-all duration-300", isHeaderCollapsed && "pt-0 pb-4")}>
              <Separator className="my-4" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                <span className="font-semibold text-sm text-muted-foreground whitespace-nowrap">
                  Progress:
                </span>
                <span className="font-semibold text-foreground text-sm">
                  {completedCount}/{modules.length} modules completed.{" "}
                  {completedCount === modules.length && (
                    <span className="text-green-600">🎉 Course completed!</span>
                  )}
                </span>
              </div>
              <ProgressBar value={completedCount} max={modules.length} />
            </CardContent>
          </Card>
        </div>
      </div>      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl md:text-2xl font-bold">Modules</h2>
          <span className="text-muted-foreground text-sm">
            ({modules.length})
          </span>
        </div>
        <Separator className="mb-6" />
        
        <TooltipProvider>
          <div className="grid gap-4 md:gap-6 lg:gap-8 sm:grid-cols-1 md:grid-cols-2">
            {modules.length === 0 && (
              <div className="text-muted-foreground text-center col-span-full py-12">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No modules yet</p>
                <p className="text-sm">This lesson doesn't have any modules yet.</p>
              </div>
            )}
            {(() => {
              let firstUnfinishedFound = false;
              return modules.map(
                (mod: {
                  id: string;
                  createdAt: Date;
                  updatedAt: Date;
                  module_name: string;
                  module_description: string;
                  learning_resource_id: string | null;
                  module_id: string | null;
                  file?: string;
                  is_finished?: boolean;
                }) => {
                  if (!mod.module_id) {
                    // Skip modules without a valid module_id
                    return null;
                  }
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
                        "transition-all duration-200 border border-muted/30 shadow-md hover:shadow-xl bg-white/95 relative group hover:-translate-y-1 hover:scale-[1.02]",
                        !canView && "opacity-60"
                      )}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start gap-3">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="rounded-full bg-muted p-2 shrink-0 mt-1">
                                {mod.is_finished ? (
                                  <CheckCircle2
                                    className="text-green-500"
                                    size={20}
                                  />
                                ) : canView ? (
                                  <FileText
                                    className="text-blue-500"
                                    size={20}
                                  />
                                ) : (
                                  <Lock className="text-gray-400" size={20} />
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
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <CardTitle className="text-base md:text-lg font-semibold leading-tight">
                                {mod.module_name}
                              </CardTitle>
                              {mod.file && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge
                                      variant="outline"
                                      className="shrink-0 flex items-center gap-1 text-xs"
                                    >
                                      <FileText size={12} />
                                      File
                                    </Badge>
                                  </TooltipTrigger>                                  <TooltipContent>
                                    {mod.file && typeof mod.file === 'object' && 'name' in mod.file 
                                      ? (mod.file as any).name 
                                      : 'File attached'}
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                            <CardDescription className="mt-2 text-sm text-muted-foreground line-clamp-3">
                              {mod.module_description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        {mod.file ? (
                          canView ? (
                            <Button
                              variant="default"
                              size="sm"
                              disabled={navigating}
                              className={cn(
                                "w-full group-hover:scale-105 transition-transform font-semibold",
                                navigating && "opacity-50 cursor-not-allowed"
                              )}
                              onClick={async () => {
                                setNavigating(true);
                                await router.push(
                                  `${lesson.learning_resource.id}/${mod.module_id}/view`
                                );
                                toast("Navigating to module...", {});
                              }}
                            >
                              {navigating ? "Loading..." : "View Module"}
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              disabled
                            >
                              <Lock className="mr-2 h-4 w-4" />
                              <span className="hidden sm:inline">Complete previous modules to unlock</span>
                              <span className="sm:hidden">Locked</span>
                            </Button>
                          )
                        ) : (
                          <span className="text-xs text-muted-foreground block">
                            No file attached
                          </span>
                        )}
                      </CardContent>
                      
                      {mod.is_finished && (
                        <div className="absolute top-3 right-3">
                          <Badge variant="secondary" className="text-green-700 bg-green-100 border-green-300">
                            <CheckCircle2 size={12} className="mr-1" />
                            <span className="hidden sm:inline">Completed</span>
                            <span className="sm:hidden">✓</span>
                          </Badge>
                        </div>
                      )}
                    </Card>
                  );
                }
              );
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
