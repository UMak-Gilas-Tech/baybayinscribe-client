import React from "react";
import { cn } from "@/lib/utils";

interface NoContentCardProps {
  message: string;
}

export function NoContentCard({ message }: NoContentCardProps) {
  return (
    <div className="w-full flex-shrink-0">
      <div className="h-44 flex flex-col items-center justify-center bg-gradient-to-br from-secondary/10 to-secondary/20 rounded-lg border border-dashed border-border shadow-inner px-8 py-6">
        <div className="mb-4">
          <svg
            width="40"
            height="40"
            viewBox="0 0 48 48"
            fill="none"
            className="mx-auto"
          >
            <circle cx="24" cy="24" r="24" className="fill-muted" />
            <path
              d="M16 32h16M24 16v8M24 28h.01"
              className="stroke-primary"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="text-card-foreground font-semibold text-base mb-2">
          {message}
        </div>
        <div className="text-muted-foreground text-xs text-center max-w-xs">
          {message.includes("lesson")
            ? "Start by adding your first lesson to help others learn Baybayin!"
            : "No quizzes available yet. Check back soon or create a new quiz to get started!"}
        </div>
      </div>
    </div>
  );
}
