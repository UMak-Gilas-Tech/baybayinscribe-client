import * as React from "react";
import { Card } from "@/components/ui/card";

export interface QuizFormCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const QuizFormCard: React.FC<QuizFormCardProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <Card
      className={`bg-[#E7ECFE] border border-stone-500 rounded-xl p-6 overflow-hidden ${
        className ?? ""
      }`}
      {...props}
    >
      {children}
    </Card>
  );
};
