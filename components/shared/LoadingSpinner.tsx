import React, { HTMLAttributes } from "react";

export type LoadingSpinnerProps = {
  loadingText?: string;
} & HTMLAttributes<HTMLDivElement>;

const LoadingSpinner = (props: LoadingSpinnerProps) => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-b-4 border-white"></div>
      {props.loadingText && (
        <p className="ml-4 text-base font-bold text-white">{props.loadingText}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
