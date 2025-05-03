"use client";
import React, { useEffect } from "react";
import axios from "@/lib/axios";
import { QuizTakeProvider } from "./QuizTakeContext";
import { QuizTakeContent } from "./QuizTakeContent";
import { QuizSchema } from "@/db/schema/quiz-schema";
import { useParams } from "next/navigation";

export default async function QuizTakePage() {
  const params = useParams();
  return (
    <QuizTakeProvider params={{ quiz_id: (params.quiz_id as string)! }}>
      <QuizTakeContent />
    </QuizTakeProvider>
  );
}
