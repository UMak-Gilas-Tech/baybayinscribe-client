import React from "react";
import { Progress } from "../../../../components/ui/progress";
import { QuestionHolderComponent } from "../../../../components/quiz/QuestionHolder";
import QuizPlayerStatistics from "../../../../components/quiz/QuizPlayerStatistics";
import MultipleChoice from "../../../../components/quiz/fields/MultipleChoice";
import Identification from "../../../../components/quiz/fields/Identification";
import SketchpadComponent from "../../../../components/quiz/Sketchpad";

export default function QuizTakePage() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100">
      <div className="flex flex-col h-screen w-full lg:px-20 md:px-14 px-10">
        <div className="flex flex-col">
          <QuizPlayerStatistics />
          {/* <QuestionHolderComponent
            questionHighlight={{
              isBaybayin: true,
              text: "a",
            }}
          /> */}
        </div>
        <SketchpadComponent />
        <div className="w-full flex items-center justify-center">
          <Progress className="w-full md:w-3/4 lg:w-1/2" />
        </div>

        {/* <MultipleChoice
          options={[
            { label: "Option 1", isCorrect: true },
            { label: "Option 2", isCorrect: false },
            { label: "Option 3", isCorrect: false },
            { label: "Option 4", isCorrect: false },
          ]}
        /> */}

        {/* <Identification /> */}
      </div>
    </div>
  );
}
