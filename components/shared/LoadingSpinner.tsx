import React, { HTMLAttributes } from "react";

export type LoadingSpinnerProps = {
  loadingText?: string;
} & HTMLAttributes<HTMLDivElement>;

const LoadingSpinner = (props: LoadingSpinnerProps) => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#576eb6]"></div>
      {props.loadingText && (
        <p className="ml-4 text-[#576eb6] font-bold text-xl">{props.loadingText}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
