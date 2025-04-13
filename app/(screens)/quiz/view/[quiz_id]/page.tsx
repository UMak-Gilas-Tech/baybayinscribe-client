"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  quizRelations,
  QuizSchema,
  metadata,
  quiz_question,
  quizDifficultyEnum,
} from "../../../../../db/schema/quiz-schema";
import { useParams, useRouter } from "next/navigation";
import useQuizStore from "@/app/store/store.quiz";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";

export default function QuizPage() {
  const [mounted, setMounted] = useState(false);
  const params = useParams();
  const router = useRouter();
  const quizId = params.quiz_id as string;

  const quizStore = useQuizStore();

  useEffect(() => {
    setMounted(true);
    quizStore.loadQuizDetails(quizId);
  }, [quizId]);

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <div className="z-30 max-w-[1044px] px-10 py-10 w-full mx-auto p-1 flex flex-col gap-2">
      {quizStore.status === "Loading" || quizStore.status == "Idle" ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-2 text-center md:text-left">
            <div className="text-black text-2xl font-bold">
              {quizStore.quiz_details!.metadata.quiz_name}
            </div>
            <div
              className={`px-3 py-1 ${
                quizStore.quiz_details!.metadata.difficulty === "Easy"
                  ? "bg-green-500"
                  : quizStore.quiz_details!.metadata.difficulty === "Moderate"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              } rounded-full shadow-md flex justify-center items-center gap-1`}
            >
              <div className="text-black text-lg font-bold font-['Inter']">
                {quizStore.quiz_details!.metadata.difficulty}
              </div>
            </div>
          </div>

          {/* Meta Section */}
          <div className="w-full flex flex-col md:flex-row justify-between items-center">
            <div className="text-[#585858] text-base font-normal font-['Inter']">
              By: {"Butty AI"}
            </div>
            <div className="text-[#585858] text-base font-normal font-['Inter']">
              {new Date(
                quizStore.quiz_details!.metadata.created_at
              ).toDateString()}
            </div>
          </div>

          {/* Quiz Info Section */}
          <div className="w-full px-4 py-2 bg-[#d3ddfd] rounded-lg shadow-md flex flex-row justify-between items-center gap-2">
            <div className="flex flex-row justify-center items-center gap-3">
              <div data-svg-wrapper className="relative">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 14C20.49 12.54 22 10.79 22 8.5C22 7.04131 21.4205 5.64236 20.3891 4.61091C19.3576 3.57946 17.9587 3 16.5 3C14.74 3 13.5 3.5 12 5C10.5 3.5 9.26 3 7.5 3C6.04131 3 4.64236 3.57946 3.61091 4.61091C2.57946 5.64236 2 7.04131 2 8.5C2 10.8 3.5 12.55 5 14L12 21L19 14Z"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="text-[#020618] text-base font-bold font-['Inter']">
                {quizStore.quiz_details!.metadata.difficulty === "Easy" && "3"}
                {quizStore.quiz_details!.metadata.difficulty === "Moderate" &&
                  "2"}
                {quizStore.quiz_details!.metadata.difficulty === "Hard" && "1"}{" "}
                Lives
              </div>
            </div>
            <div className="flex flex-row justify-center items-center gap-3">
              <div data-svg-wrapper className="relative">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 2H14M12 14L15 11"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 22C16.4183 22 20 18.4183 20 14C20 9.58172 16.4183 6 12 6C7.58172 6 4 9.58172 4 14C4 18.4183 7.58172 22 12 22Z"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="text-[#020618] text-base font-bold font-['Inter']">
                {quizStore.quiz_details!.metadata.difficulty === "Easy" && "30"}
                {quizStore.quiz_details!.metadata.difficulty === "Moderate" &&
                  "15"}
                {quizStore.quiz_details!.metadata.difficulty === "Hard" && "7"}{" "}
                Seconds
              </div>
            </div>
            <div className="flex flex-row justify-center items-center gap-3">
              <div data-svg-wrapper className="relative">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 16V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H15"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 18H11C10.4696 18 9.96086 18.2107 9.58579 18.5858C9.21071 18.9609 9 19.4696 9 20M9 20C9 20.5304 9.21071 21.0391 9.58579 21.4142C9.96086 21.7893 10.4696 22 11 22H21.5C21.6326 22 21.7598 21.9473 21.8536 21.8536C21.9473 21.7598 22 21.6326 22 21.5V6.5C22 6.36739 21.9473 6.24021 21.8536 6.14645C21.7598 6.05268 21.6326 6 21.5 6H11C10.4696 6 9.96086 6.21071 9.58579 6.58579C9.21071 6.96086 9 7.46957 9 8V20ZM5 14H4C3.46957 14 2.96086 14.2107 2.58579 14.5858C2.21071 14.9609 2 15.4696 2 16C2 16.5304 2.21071 17.0391 2.58579 17.4142C2.96086 17.7893 3.46957 18 4 18H5"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="text-[#020618] text-base font-bold font-['Inter']">
                {quizStore.quiz_details!.questions.length} Items
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="w-full flex flex-col gap-2 py-4">
            <div className="text-black text-base font-bold font-['Inter'] text-start w-full">
              Description
            </div>
            <div className="text-justify text-black text-base font-normal font-['Inter']">
              {quizStore.quiz_details!.metadata.description ??
                "There is no description available."}
            </div>
          </div>

          {/* Previous Takes Section */}
          <div className="w-full flex flex-col gap-2">
            <div className="text-black text-base font-bold font-['Inter'] text-start">
              Previous Takes
            </div>
            <div className="w-full px-4 py-2 bg-[#d3ddfd] rounded-lg shadow-md flex flex-row justify-between items-center gap-2">
              <div className="text-[#020618] text-base font-bold font-['Inter']">
                Attempt
              </div>
              <div className="text-[#020618] text-base font-bold font-['Inter']">
                Score
              </div>
              <div className="text-[#020618] text-base font-bold font-['Inter']">
                Time Took
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col items-center justify-center gap-2 py-4">
            <Button className="w-full" onClick={() => router.push(`/quiz/take/${quizId}`)}>Start Quiz</Button>
          </div>
        </>
      )}
    </div>
  );
}
