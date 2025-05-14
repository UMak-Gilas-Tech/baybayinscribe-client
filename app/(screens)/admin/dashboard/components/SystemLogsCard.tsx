import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Circle } from "lucide-react";

interface Log {
  type: "info" | "warning" | "error" | "success";
  message: string;
  time: string;
}

interface SystemLogsCardProps {
  logs: Log[];
}

export function SystemLogsCard({ logs }: SystemLogsCardProps) {
  return (
    <Card className="py-3 h-[265px] xl:h-[408px] border-grey-300 border-1 bg-neutral-white/50 overflow-hidden">
      <CardContent className="p-0 h-full">
        <ScrollArea className="h-full scroll-smooth">
          <div className="flex flex-col gap-2 p-4 pb-1">
            {logs.map((log, i) => (
              <div
                key={i}
                className="flex items-center gap-2 p-2 rounded bg-blue-50 border border-blue-100 w-full"
              >
                {log.type === "info" && (
                  <Circle className="w-4 h-4 text-blue-400 bg-blue-800/70 rounded-full" />
                )}
                {log.type === "warning" && (
                  <Circle className="w-4 h-4 text-yellow-500 bg-yellow-300/70 rounded-full" />
                )}
                {log.type === "error" && (
                  <Circle className="w-4 h-4 text-red-500 bg-red-300/70 rounded-full" />
                )}
                {log.type === "success" && (
                  <Circle className="w-4 h-4 text-green-500 bg-green-300/70 rounded-full" />
                )}
                <span className="flex-1 text-blue-200 text-sm">
                  {log.message}
                </span>
                <span className="text-xs text-blue-400">{log.time}</span>
              </div>
            ))}
          </div>
          <ScrollBar className="bg-blue-200/20" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
