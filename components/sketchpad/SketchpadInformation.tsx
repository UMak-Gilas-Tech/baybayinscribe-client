import React from "react";

// export the hook for external state control
export const useSketchpadInfo = (): [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>
] => React.useState(false);

interface SketchpadInformationProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SketchpadInformation = ({
  open,
  setOpen,
}: SketchpadInformationProps) => {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0E1425]/95 p-6"
          onClick={() => setOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setOpen(false)}
              className="absolute top-20 right-10 text-white text-3xl hover:cursor-pointer sm:text-4xl"
            >
              &times;
            </button>
            <h1 className="mb-4 text-white font-semibold text-2xl sm:text-3xl md:text-4xl">
              How to Use the Tracing Tool
            </h1>
            <h2 className="mt-2 flex items-center gap-2 text-lg sm:text-xl md:text-2xl font-semibold text-white">
              🧑‍🏫 How to Use
            </h2>
            <ul className="mt-2 list-disc list-inside space-y-2 text-base sm:text-lg md:text-xl text-white">
              <li>Tap a character to load it in your sketchpad for tracing.</li>
              <li>Draw to get feedback; AI will score accuracy and strokes.</li>
              <li>Use Explore Mode to practice multiple characters freely.</li>
              <li>Filter with the dropdown: Essentials, Kudlit, Special. Default is All.</li>
            </ul>
            <h2 className="mt-4 flex items-center gap-2 text-lg sm:text-xl md:text-2xl font-semibold text-white">
              💡 Quick Tips
            </h2>
            <ul className="mt-2 list-disc list-inside space-y-2 text-base sm:text-lg md:text-xl text-white">
              <li>Scroll to view all characters.</li>
              <li>Change filters anytime.</li>
              <li>Greyed-out characters are disabled for the current mode.</li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default SketchpadInformation;