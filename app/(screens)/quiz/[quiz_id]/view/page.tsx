"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import useQuizStore from "@/app/store/store.quiz";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { authClient } from "@/app/lib/auth-client";

export default function QuizPage() {
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();
  const quizId = params.quiz_id as string;

  const quizStore = useQuizStore();

  useEffect(() => {
    (async () => {
      const session = await authClient.getSession();
      if (session.data) {
        setUserId(session.data.user.id);
      }
    })();
  }, [quizId]);

  useEffect(() => {
    if (userId === null) return;
    setMounted(true);
    quizStore.loadQuizDetails(quizId);
    quizStore.loadQuizAnswerHistory(quizId, userId!);
  }, [quizId, userId, quizStore]);

  if (!mounted) return null;

  if (quizStore.status !== "Loading" && !quizStore.quiz_details) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-50 rounded-xl shadow-lg mt-10 max-w-lg mx-auto">
        <div className="text-2xl font-semibold mb-2">Error</div>
        <div>Quiz details not found.</div>
      </div>
    );
  }

  return (
    <div className="z-30 max-w-2xl md:max-w-3xl lg:max-w-4xl px-4 md:px-10 py-10 w-full mx-auto flex flex-col gap-6 mt-10">
      {quizStore.status === "Loading" || quizStore.status === "Idle" ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {/* Header Section */}
          <div className="flex items-center gap-3 mb-2">
            <button
              className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 transition"
              onClick={() => router.back()}
              aria-label="Go Back"
            >
              <ChevronLeft size={28} className="text-blue-600" />
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              {quizStore.quiz_details?.metadata?.quiz_name ?? "Untitled Quiz"}
            </h1>
            <span
              className={`ml-auto px-4 py-1 rounded-full text-sm font-semibold shadow transition
                ${
                  quizStore.quiz_details?.metadata?.difficulty === "Easy"
                    ? "bg-green-100 text-green-700"
                    : quizStore.quiz_details?.metadata?.difficulty ===
                      "Moderate"
                    ? "bg-yellow-100 text-yellow-700"
                    : quizStore.quiz_details?.metadata?.difficulty === "Hard"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-200 text-gray-700"
                }
              `}
            >
              {quizStore.quiz_details?.metadata?.difficulty ?? "Unknown"}
            </span>
          </div>

          {/* Meta Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-gray-500 text-sm mb-2">
            <div>
              <span className="font-medium text-gray-700">By:</span> Butty AI
            </div>
            <div>
              <span className="font-medium text-gray-700">Created:</span>{" "}
              {quizStore.quiz_details?.metadata?.created_at
                ? new Date(
                    quizStore.quiz_details.metadata.created_at
                  ).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "Unknown Date"}
            </div>
          </div>

          {/* Quiz Info Section */}
          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-xl shadow p-6 border border-blue-100">
            <div className="flex flex-row items-center gap-3">
              <div className="relative">
                {/* Heart SVG */}
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M19 14C20.49 12.54 22 10.79 22 8.5C22 7.04131 21.4205 5.64236 20.3891 4.61091C19.3576 3.57946 17.9587 3 16.5 3C14.74 3 13.5 3.5 12 5C10.5 3.5 9.26 3 7.5 3C6.04131 3 4.64236 3.57946 3.61091 4.61091C2.57946 5.64236 2 7.04131 2 8.5C2 10.8 3.5 12.55 5 14L12 21L19 14Z"
                    stroke="#2563eb"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="text-lg font-semibold text-blue-700">
                {quizStore.quiz_details?.metadata?.difficulty === "Easy"
                  ? "3"
                  : quizStore.quiz_details?.metadata?.difficulty === "Moderate"
                  ? "2"
                  : quizStore.quiz_details?.metadata?.difficulty === "Hard"
                  ? "1"
                  : "0"}{" "}
                Lives
              </div>
            </div>
            <div className="flex flex-row items-center gap-3">
              <div className="relative">
                {/* Clock SVG */}
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M10 2H14M12 14L15 11"
                    stroke="#2563eb"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 22C16.4183 22 20 18.4183 20 14C20 9.58172 16.4183 6 12 6C7.58172 6 4 9.58172 4 14C4 18.4183 7.58172 22 12 22Z"
                    stroke="#2563eb"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="text-lg font-semibold text-blue-700">
                {quizStore.quiz_details?.metadata?.difficulty === "Easy"
                  ? "30"
                  : quizStore.quiz_details?.metadata?.difficulty === "Moderate"
                  ? "15"
                  : quizStore.quiz_details?.metadata?.difficulty === "Hard"
                  ? "7"
                  : "0"}{" "}
                Seconds
              </div>
            </div>
            <div className="flex flex-row items-center gap-3">
              <div className="relative">
                {/* Items SVG */}
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M2 16V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H15"
                    stroke="#2563eb"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 18H11C10.4696 18 9.96086 18.2107 9.58579 18.5858C9.21071 18.9609 9 19.4696 9 20M9 20C9 20.5304 9.21071 21.0391 9.58579 21.4142C9.96086 21.7893 10.4696 22 11 22H21.5C21.6326 22 21.7598 21.9473 21.8536 21.8536C21.9473 21.7598 22 21.6326 22 21.5V6.5C22 6.36739 21.9473 6.24021 21.8536 6.14645C21.7598 6.05268 21.6326 6 21.5 6H11C10.4696 6 9.96086 6.21071 9.58579 6.58579C9.21071 6.96086 9 7.46957 9 8V20ZM5 14H4C3.46957 14 2.96086 14.2107 2.58579 14.5858C2.21071 14.9609 2 15.4696 2 16C2 16.5304 2.21071 17.0391 2.58579 17.4142C2.96086 17.7893 3.46957 18 4 18H5"
                    stroke="#2563eb"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="text-lg font-semibold text-blue-700">
                {quizStore.quiz_details?.questions?.length ?? 0} Items
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="w-full flex flex-col gap-2 py-4">
            <div className="text-xl font-semibold text-gray-800 mb-1">
              Description
            </div>
            <div className="text-gray-700 text-base bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm">
              {quizStore.quiz_details?.metadata?.description ??
                "There is no description available."}
            </div>
          </div>

          {/* Previous Takes Section */}
          <div className="text-xl font-semibold text-gray-800 mb-2">
            Previous Attempts
          </div>
          <div className="overflow-x-auto rounded-lg shadow border border-gray-100 bg-white">
            <table className="w-full min-w-[350px]">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-700 text-base font-semibold">
                    Attempt
                  </th>
                  <th className="px-4 py-3 text-left text-gray-700 text-base font-semibold">
                    Score
                  </th>
                  {/* <th className="px-4 py-3 text-left text-gray-700 text-base font-semibold">
                    Time Took
                  </th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {quizStore.answerHistory &&
                quizStore.answerHistory.length > 0 ? (
                  quizStore.answerHistory.map((answer, idx) => (
                    <tr key={idx} className="hover:bg-blue-50 transition">
                      <td className="px-4 py-2">Attempt #{answer.attempt}</td>
                      <td className="px-4 py-2">
                        {answer.score} /{" "}
                        {quizStore.quiz_details?.questions.length}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-4 text-center text-gray-400"
                    >
                      No answer history!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="w-full flex flex-col items-center justify-center gap-2 py-4">
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold py-3 rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 transition"
              onClick={() => router.push(`/quiz/take/${quizId}`)}
            >
              Start Quiz
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
