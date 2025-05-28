"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { HouseIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BackButtonProps {
  className?: string;
}

export const BackButton = ({ className = "" }: BackButtonProps) => {
  const router = useRouter();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className={`hover:bg-blue-800 ${className}`}
            aria-label="Go back"
          >
            <HouseIcon className="h-5 w-5 text-blue-400" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Go back to login</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
