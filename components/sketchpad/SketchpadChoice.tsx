import React from "react";
import ButtyPaint from "@/public/images/ButtyPaint.png";
import ButtyPencilRun from "@/public/images/ButtyPencilRun.png";

const SketchpadChoice = () => {
  return (
    <div className="flex flex-col items-center h-auto p-4 md:p-8">
      {/* header - desktop only */}
      <div className="hidden md:flex flex-row gap-4 items-center justify-center w-full md:w-1/2">
        <div className="h-[1px] w-[10%] bg-black"></div>
        <span className="text-5xl font-bold text-center w-full md:w-3/4">
          How would you like to trace?
        </span>
        <div className="h-[1px] w-[10%] bg-black"></div>
      </div>
      {/* subtext - desktop only */}
      <span className="hidden md:block text-xl text-center w-full md:w-1/4 mt-4 mb-8">
        Choose your preferred tracing style for the Baybayin characters
      </span>

      {/* choices + mobile header */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-center w-full">
        <div className="flex flex-col items-center justify-center w-full md:w-1/2 hover:scale-90 hover:opacity-50 transition-all duration-300 ease-in-out cursor-pointer mb-4 md:mb-0 px-2">
          <img className="w-full max-w-xs h-auto object-contain" src={ButtyPaint.src} alt="" />
          <h2 className="text-2xl font-bold mb-2">Learn Step-by-step</h2>
          <p className="text-center w-full md:w-1/2">
            Follow along and trace characters one part at a time. Perfect for learning!
          </p>
        </div>

        {/* header - mobile only */}
        <div className="flex md:hidden flex-col items-center w-full my-4">
          <div className="flex flex-row gap-4 items-center justify-center w-full">
            <div className="h-[1px] w-[10%] bg-black"></div>
            <span className="text-3xl font-bold text-center w-full">
              How would you like to trace?
            </span>
            <div className="h-[1px] w-[10%] bg-black"></div>
          </div>
          <span className="text-lg text-center w-full mt-2">
            Choose your preferred tracing style for the Baybayin characters
          </span>
        </div>

        <div className="hidden md:block h-96 w-[1px] bg-black"></div>
        <div className="flex flex-col items-center justify-center w-full md:w-1/2 hover:scale-90 hover:opacity-50 transition-all duration-300 ease-in-out cursor-pointer mb-4 md:mb-0 px-2">
          <img className="w-full max-w-xs h-auto object-contain" src={ButtyPencilRun.src} alt="" />
          <h2 className="text-2xl font-bold mb-2">Explore Freely</h2>
          <p className="text-center w-full md:w-1/2">
            Trace characters in multiple strokes. Great for testing and exploring!
          </p>
        </div>
      </div>
    </div>
  );
};

export default SketchpadChoice;
