"use client";

import { ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

type SwitchButtonProps = {
  onClick: () => void;
  isMobile?: boolean;
  currentOrder: boolean; // true if Baybayin is first, false if Latin is first
};

export function SwitchButton({
  onClick,
  isMobile = false,
  currentOrder,
}: SwitchButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    setIsPressed(true);
    onClick();
    setTimeout(() => setIsPressed(false), 200);
  };

  const getSwitchText = () => {
    if (currentOrder) {
      return (
        <>
          <span>Latin</span>
          <ArrowRightLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-blue-300 transition-transform duration-300" />
          <span>Baybayin</span>
        </>
      );
    }
    return (
      <>
        <span>Baybayin</span>
        <ArrowRightLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-blue-300 transition-transform duration-300" />
        <span>Latin</span>
      </>
    );
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size={isMobile ? "default" : "icon"}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`${
              isMobile
                ? "w-1/3 min-w-[140px] flex items-center justify-center gap-2 py-1.5 px-3 bg-neutral-white border-1.25 border-blue-400 hover:bg-blue-800/20 ml-auto"
                : "hidden md:flex bg-neutral-white border-1.25 border-blue-400 hover:bg-blue-800/20"
            } transition-all duration-300 ease-in-out ${
              isHovered ? "shadow-md" : "shadow-sm"
            } ${isPressed ? "scale-95" : "scale-100"}`}
          >
            {isMobile ? (
              <div className="flex items-center gap-1.5">{getSwitchText()}</div>
            ) : (
              <ArrowRightLeft
                className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-300 transition-transform duration-300 ${
                  isHovered ? "rotate-180" : "rotate-0"
                }`}
              />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side={isMobile ? "bottom" : "right"}
          className="backdrop-blur-sm text-xs sm:text-sm md:text-base px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-lg shadow-lg"
        >
          <p className="font-medium">
            Switch from{" "}
            {currentOrder ? "Latin to Baybayin" : "Baybayin to Latin"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
