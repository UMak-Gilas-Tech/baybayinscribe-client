import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="w-56 flex-shrink-0">
      <div className="bg-card rounded-lg overflow-hidden shadow-sm border border-border">
        <div className="relative h-44 bg-secondary/20 flex items-center justify-center p-4">
          <Skeleton className="w-20 h-20 rounded-md" />
        </div>
        <div className="p-4">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-3 w-40 mb-4" />
          <Skeleton className="h-8 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}
