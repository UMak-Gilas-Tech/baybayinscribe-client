import { Quiz } from "@/types/type.quiz";
import { Clock } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

type QuizCardProps = {
  quiz: Quiz;
};

export default function QuizCard({ quiz }: QuizCardProps) {
  const router = useRouter();
  return (
    <div className="flex flex-col aspect-square max-h-48 w-full border rounded-lg shadow-md p-4 bg-[#dbe3fa] hover:bg-[#BFCCF8] cursor-pointer transition duration-200 ease-in-out gap-2 justify-between">
      <div className="flex flex-col gap-1">
        <div className="flex flex-row gap-4">
          <h2 className="font-bold flex">{quiz.metadata.quiz_name}</h2>
        </div>

        <div className="flex flex-row justify-between  *:text-xs">
          <span
            className={`${
              quiz.metadata.difficulty === "Easy"
                ? "bg-green-500"
                : quiz.metadata.difficulty === "Moderate"
                ? "bg-yellow-500"
                : quiz.metadata.difficulty === "Hard"
                ? "bg-red-500"
                : "bg-gray-500"
            } rounded-full text-white px-4 py-1`}
          >
            {quiz.metadata.difficulty}
          </span>
          <div className="flex flex-row gap-1 items-center justify-center">
            <Clock size={15} />
            <span className="">{quiz.metadata.time_limit}</span>
          </div>
          <span className="">
            {new Date(quiz.metadata.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      <Button
        className="bg-blue-500"
        onClick={() => router.push(`/quiz/view/${quiz.metadata.quiz_id}`)}
      >
        Take Quiz
      </Button>
    </div>
  );
}
