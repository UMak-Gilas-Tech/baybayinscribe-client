import React from "react";
import { Heart, HeartIcon, Hourglass } from "lucide-react";
const QuizPlayerStatistics = () => {
  return (
    <div className="w-full p-2 sm:p-4 rounded-lg inline-flex justify-between items-center">
      <div className="flex justify-start items-center gap-4">
        <HeartIcon className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" fill="#ff0000" />
        <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" fill="#ff0000" />
        <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
      </div>
      <div className="px-6 py-2 bg-violet-200 rounded-3xl flex justify-start items-center gap-6">
        <div className="w-12 h-12 sm:w-14 sm:h-14 relative rounded-full bg-[#576Eb6] p-4">
          <span className="absolute inset-0 flex items-center justify-center text-orange-200 text-xl sm:text-2xl font-bold font-['Work_Sans']">
            15
          </span>
        </div>
        <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 relative overflow-hidden">
          <Hourglass className="w-8 h-8 sm:w-9 sm:h-9" />
        </div>
      </div>
    </div>
  );
};

export default QuizPlayerStatistics;
