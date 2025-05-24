"use client";
import React from "react";
import { QuizTakeProvider } from "./QuizTakeContext";
import { QuizTakeContent } from "./QuizTakeContent";
import { useParams } from "next/navigation";

export default function QuizTakePage() {
  const params = useParams();
  return (
    <QuizTakeProvider params={{ quiz_id: (params.quiz_id as string)! }}>
      <QuizTakeContent />
    </QuizTakeProvider>
  );
}
