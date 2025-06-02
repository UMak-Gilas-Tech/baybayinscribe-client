"use client";

import React, { useEffect } from "react";
import QuizList from "@/components/QuizList";
import useQuizStore from "@/app/store/store.quiz";

export default function QuizScreen() {
  const { loadAllQuiz, error, status, quizzes } = useQuizStore();

  useEffect(() => {
    loadAllQuiz();
  }, [loadAllQuiz]);

  if (error)
    return <div className="text-red-500 p-4">Error loading quizzes.</div>;
  if (status == "Loading" || status == "Idle")
    return <div className="text-gray-700 p-4">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Available Quizzes</h1>
      <QuizList quizzes={quizzes!} />
    </div>
  );
}
