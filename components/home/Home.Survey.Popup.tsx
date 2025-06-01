"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Code, User } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Image from "next/image";

// Types
type SurveyStep = "initial" | "it" | "non-it";

interface SurveyPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

// Constants
const SURVEY_CONFIG = {
  urls: {
    it: "https://forms.gle/dtSeVxRCrD3XaaQR6",
    "non-it": "https://forms.gle/DvgithMtw8cA1gfG9",
  },
  options: [
    {
      id: "it",
      icon: Code,
      title: "IT Expert",
      description: "For developers and tech professionals",
    },
    {
      id: "non-it",
      icon: User,
      title: "Non-IT User",
      description: "For general users and enthusiasts",
    },
  ],
} as const;

// Animation
const waveAnimation = `
@keyframes wave {
  0% { transform: translateX(-50%) rotate(0deg); }
  20% { transform: translateX(-50%) rotate(-8deg); }
  40% { transform: translateX(-50%) rotate(0deg); }
  60% { transform: translateX(-50%) rotate(8deg); }
  80% { transform: translateX(-50%) rotate(0deg); }
  100% { transform: translateX(-50%) rotate(0deg); }
}
`;

// UI Components
const SurveyOption = ({
  icon: Icon,
  title,
  description,
  onClick,
}: {
  icon: typeof Code;
  title: string;
  description: string;
  onClick: () => void;
}) => (
  <Button
    variant="outline"
    className="h-auto min-h-[120px] py-4 flex flex-col items-center gap-2 hover:bg-blue-50 w-full"
    onClick={onClick}
  >
    <Icon className="text-blue-600 !w-8 !h-8" />
    <header className="text-center w-[90%]">
      <h3 className="font-medium mb-1 text-md">{title}</h3>
      <p className="text-sm text-grey-300 font-normal whitespace-normal">
        {description}
      </p>
    </header>
  </Button>
);

const DontShowAgainCheckbox = ({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id: string;
}) => (
  <div className="flex items-center space-x-2">
    <Checkbox
      id={id}
      checked={checked}
      onCheckedChange={(checked) => onChange(checked as boolean)}
    />
    <Label htmlFor={id} className="text-sm font-normal cursor-pointer">
      Don&apos;t show this again
    </Label>
  </div>
);

// Main Content Component
const SurveyContent = ({
  step,
  dontShowAgain,
  onDontShowAgainChange,
  onClose,
}: {
  step: SurveyStep;
  dontShowAgain: boolean;
  onDontShowAgainChange: (checked: boolean) => void;
  onClose: () => void;
}) => {
  const isInitialStep = step === "initial";
  const checkboxId = `dont-show-again${isInitialStep ? "-initial" : ""}`;

  if (isInitialStep) {
    return (
      <>
        <DialogHeader>
          <DialogTitle className="mt-8">
            Help Us Improve BaybayInscribe!
          </DialogTitle>
          <DialogDescription>
            BaybayInscribe is in early development. Your feedback would help us
            shape its future. Select your expertise level below.
          </DialogDescription>
        </DialogHeader>
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SURVEY_CONFIG.options.map((option) => (
            <SurveyOption
              key={option.id}
              icon={option.icon}
              title={option.title}
              description={option.description}
              onClick={() => {
                if (dontShowAgain) {
                  localStorage.setItem("hasSeenSurvey", "true");
                }
                window.open(
                  SURVEY_CONFIG.urls[option.id as "it" | "non-it"],
                  "_blank"
                );
                onClose();
              }}
            />
          ))}
        </section>
        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <DontShowAgainCheckbox
            checked={dontShowAgain}
            onChange={onDontShowAgainChange}
            id={checkboxId}
          />
          <Button variant="ghost" onClick={onClose}>
            Maybe Later
          </Button>
        </DialogFooter>
      </>
    );
  }

  return null;
};

// Main Export Component
export function SurveyPopup({ isOpen, onClose }: SurveyPopupProps) {
  const [showSurvey, setShowSurvey] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    // For testing: Uncomment this to force show the survey
    setShowSurvey(true);

    // Random survey popup for production users
    // if (process.env.NEXT_PUBLIC_VERCEL_ENV !== "development") {
    //   // 40% chance to show survey
    //   const shouldShowSurvey = Math.random() < 0.4;
    //   if (shouldShowSurvey) {
    //     // Check if user has already seen the survey
    //     const hasSeenSurvey = localStorage.getItem("hasSeenSurvey");
    //     if (!hasSeenSurvey) {
    //       // Delay the popup by 5 seconds
    //       const timer = setTimeout(() => {
    //         setShowSurvey(true);
    //         localStorage.setItem("hasSeenSurvey", "true");
    //       }, 5000);
    //       return () => clearTimeout(timer);
    //     }
    //   }
    // }
  }, []);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem("hasSeenSurvey", "true");
    }
    setShowSurvey(false);
    onClose();
  };

  return (
    <Dialog open={isOpen && showSurvey} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] overflow-visible">
        <div className="hidden sm:block absolute -top-24 left-5 -z-10">
          <Image
            src="/images/ButtyWave.webp"
            alt="Baybayin Character Waving"
            width={120}
            height={120}
            className="object-contain animate-[wave_3s_ease-in-out_infinite]"
            priority
          />
          <style>{waveAnimation}</style>
        </div>
        <SurveyContent
          step="initial"
          dontShowAgain={dontShowAgain}
          onDontShowAgainChange={(checked) =>
            setDontShowAgain(checked as boolean)
          }
          onClose={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
}
