"use client";

import React, { useState } from "react";

interface MultipleChoiceItemProps {
  // Called when the item is clicked.
  onClick?: () => void;
  // Label to display in the item.
  label?: string;
  // Outcome status: 'default', 'correct', or 'wrong'
  result?: "default" | "correct" | "wrong";
  // Disable the button if true.
  disabled?: boolean;
}

const MultipleChoiceItem = ({
  onClick,
  label = "Option",
  result = "default",
  disabled = false,
}: MultipleChoiceItemProps) => {
  // Determine background class based on result
  const bgClass =
    result === "correct"
      ? "bg-green-500"
      : result === "wrong"
      ? "bg-red-500"
      : "bg-[#576Eb6] hover:bg-[#4a5b9e]";
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`z-10 flex items-center gap-2 ${bgClass} rounded-xl p-4 cursor-pointer transition-all duration-200 ease-in-out ${
        disabled ? "pointer-events-none" : ""
      }`}
      role="button"
    >
      <span className="text-white text-center w-full">{label}</span>
    </div>
  );
};

export type Option = {
  label: string;
  isCorrect: boolean;
};

interface MultipleChoiceProps {
  options?: Option[];
  onAnswer?: (selected: Option, isCorrect: boolean) => void;
}

const MultipleChoice = ({ options = [], onAnswer }: MultipleChoiceProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleChoice = (index: number) => {
    if (selectedIndex === null) {
      setSelectedIndex(index);
      const chosenOption = options[index];
      onAnswer?.(chosenOption, chosenOption.isCorrect);
    }
  };

  return (
    <div className="w-full p-2 sm:p-4 rounded-lg lg:grid md:grid lg:grid-cols-2 md:grid-cols-2 flex flex-col gap-4">
      {options ? (
        options.map((option, index) => {
          let result: "default" | "correct" | "wrong" = "default";
          if (selectedIndex !== null) {
            if (index === selectedIndex) {
              result = option.isCorrect ? "correct" : "wrong";
            } else if (option.isCorrect) {
              result = "correct";
            }
          }
          return (
            <MultipleChoiceItem
              key={index}
              onClick={() => handleChoice(index)}
              label={option.label}
              result={result}
              disabled={selectedIndex !== null}
            />
          );
        })
      ) : (
        <span>Weird. Something should be here!</span>
      )}
    </div>
  );
};

export default MultipleChoice;
