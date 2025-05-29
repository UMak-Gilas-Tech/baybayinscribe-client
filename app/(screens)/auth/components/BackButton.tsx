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
            onClick={() => router.push("/auth/login")}
            className={`hover:bg-blue-800 ${className}`}
            aria-label="Go back to login"
            tabIndex={0}
            role="link"
          >
            <HouseIcon className="text-blue-400" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Go back to login</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
