import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Circle, X } from "lucide-react";
import { toast } from "sonner";

interface Log {
  type: "info" | "warning" | "error" | "success";
  message: string;
  time: string;
}

interface SystemLogsCardProps {
  logs: Log[];
  showSkeleton?: boolean;
}

export function SystemLogsCard({
  logs,
  showSkeleton = false,
}: SystemLogsCardProps) {
  const [logsState, setLogsState] = useState<Log[]>(logs);

  const handleRemoveLog = (index: number) => {
    setLogsState((prevLogs) => prevLogs.filter((_, i) => i !== index));
    toast.success("Log removed successfully");
  };

  return (
    <Card className="py-3 h-[265px] xl:h-[400px] border-grey-300 border-1 bg-neutral-white/50 overflow-hidden">
      <CardContent className="p-0 h-full">
        <ScrollArea className="h-full scroll-smooth">
          <div className="flex flex-col gap-2 p-4 pb-1">
            {showSkeleton ? (
              // Skeleton loading state
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2 rounded bg-blue-50/50 border border-blue-100/50 w-full animate-pulse"
                >
                  <div className="w-4 h-4 rounded-full bg-blue-200/50" />
                  <div className="flex-1 h-4 bg-blue-200/50 rounded" />
                  <div className="w-16 h-3 bg-blue-200/50 rounded" />
                </div>
              ))
            ) : logsState.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[200px] text-blue-100">
                <p className="text-lg font-medium">No System Logs</p>
                <p className="text-sm text-blue-200/80">
                  System is running smoothly with no recent events
                </p>
              </div>
            ) : (
              logsState.map((log, i) => (
                <div
                  key={i}
                  className="group flex items-center gap-2 p-2 rounded bg-blue-50 border border-blue-100 w-full relative hover:bg-blue-400/15 transition-all duration-200 ease-in-out hover:shadow-sm hover:scale-[1.01] hover:-translate-y-0.5"
                >
                  {log.type === "info" && (
                    <Circle className="w-4 h-4 text-blue-400 bg-blue-800/70 rounded-full transition-transform duration-200 group-hover:scale-110" />
                  )}
                  {log.type === "warning" && (
                    <Circle className="w-4 h-4 text-yellow-500 bg-yellow-300/70 rounded-full transition-transform duration-200 group-hover:scale-110" />
                  )}
                  {log.type === "error" && (
                    <Circle className="w-4 h-4 text-red-500 bg-red-300/70 rounded-full transition-transform duration-200 group-hover:scale-110" />
                  )}
                  {log.type === "success" && (
                    <Circle className="w-4 h-4 text-green-500 bg-green-300/70 rounded-full transition-transform duration-200 group-hover:scale-110" />
                  )}
                  <span className="flex-1 text-blue-200 text-sm transition-colors duration-200 group-hover:text-blue-300">
                    {log.message}
                  </span>
                  <span className="text-xs text-blue-400 transition-colors duration-200 group-hover:text-blue-500">
                    {log.time}
                  </span>
                  <button
                    onClick={() => handleRemoveLog(i)}
                    className="absolute right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out p-1.5 hover:bg-red-100/80 rounded-full hover:scale-110 hover:rotate-90 transform"
                    aria-label="Remove log"
                  >
                    <X className="w-4 h-4 text-red-500 transition-colors duration-200 group-hover:text-red-600" />
                  </button>
                </div>
              ))
            )}
          </div>
          <ScrollBar className="bg-blue-200/20" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
