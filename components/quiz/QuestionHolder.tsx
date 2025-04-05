import React, { HTMLAttributes } from "react";

export type QuestionHolderProps = {
  questionHighlight?: QuestionTextHolder;
  questionText?: QuestionTextHolder;
} & HTMLAttributes<HTMLDivElement>;

export type QuestionTextHolder = {
  text: string;
  isBaybayin: boolean;
};

export const QuestionHolderComponent = (props: QuestionHolderProps) => {
  return (
    <div className="w-full flex items-center justify-center h-fit pt-14">
      <div className="w-fit relative bg-[#3f5087] rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] inline-flex flex-col justify-start items-center p-4 transition-all ">
        {props.questionHighlight != undefined ? (
          <div className="lg:w-[400px] md:w-[350px] w-[250px] h-24 md:h-32 lg:h-52 py-14 flex flex-col justify-center gap-2.5">
            <span
              className={`w-full justify-center text-center text-orange-200 lg:text-[100px] text-[50px] md:-text-[70px] font-normal mt-4 ${
                props.questionHighlight.isBaybayin
                  ? 'font-["Baybayin_Simple_TAWBID"]'
                  : ""
              }`}
            >
              {props.questionHighlight.text}
            </span>
          </div>
        ) : null}

        <div
          className={`flex items-center justify-center absolute bottom-full inset-0 ${
            props.questionHighlight != undefined
              ? "w-96 left-1/2 -translate-x-1/2"
              : "w-[600px] right-1/2 -translate-x-1/2 translate-y-1/2"
          } `}
        >
          <div className="w-full lg:h-26 h-full px-9 lg:py-9 md:py-9 py-6 bg-blue-950 rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] inline-flex justify-center items-center gap-2.5">
            <div className=" text-center justify-center text-orange-200 lg:text-2xl md:text-xl font-bold font-['Work_Sans']">
              What is “B” in baybayin? Do you like it or hate it?????
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
