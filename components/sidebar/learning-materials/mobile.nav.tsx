"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useLearningResourceStore } from "@/app/store/store.lr";
import useQuizStore from "@/app/store/store.quiz";

interface NavCardProps {
  title: string;
  description: string;
  href: string;
  buttonText?: string;
  image?: string;
  isComingSoon?: boolean;
}

function GuideCard({
  title,
  description,
  href,
  buttonText = "Start Learning",
  image,
  isComingSoon = false,
}: NavCardProps) {
  return (
    <div className="relative bg-gray-200 rounded-lg overflow-hidden shadow-sm border border-blue-200 mb-3">
      <div className="relative flex items-center gap-4 p-4">
        <div className="flex-shrink-0 w-16 h-16 bg-[#e9f5f2] flex items-center justify-center rounded-md">
          {image ? (
            <div className="relative w-14 h-14">
              <Image
                src={image}
                alt={title}
                className="object-contain"
                fill
                sizes="56px"
              />
            </div>
          ) : (
            <div className="w-8 h-8 flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
                  fill="#4285F4"
                />
                <path
                  d="M14 17H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
                  fill="#4285F4"
                />
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-[#1e3e59] mb-1">{title}</h3>
          <p className="text-xs text-gray-500 mb-2 line-clamp-2">{description}</p>
          <Link
            href={href}
            className={`block w-full py-2 text-center text-white rounded-md text-xs font-medium transition-colors ${
              isComingSoon
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#1e3e59] hover:bg-[#152d42]"
            }`}
          >
            {buttonText}
          </Link>
        </div>
      </div>
      {isComingSoon && (
        <div className="bg-white bg-opacity-80 flex items-center justify-center absolute inset-0 rounded-lg"></div>
      )}
    </div>
  );
}

function QuizCard({
  title,
  description,
  href,
  buttonText = "Start Learning",
  image,
}: NavCardProps) {
  return (
    <div className="bg-gray-200 rounded-lg overflow-hidden shadow-sm border border-blue-200 mb-3">
      <div className="flex items-center gap-4 p-4">
        <div className="flex-shrink-0 w-16 h-16 bg-[#e9f5f2] flex items-center justify-center rounded-md">
          {image ? (
            <div className="relative w-14 h-14">
              <Image
                src={image}
                alt={title}
                className="object-contain"
                fill
                sizes="56px"
              />
            </div>
          ) : (
            <div className="w-8 h-8 flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
                  fill="#4285F4"
                />
                <path
                  d="M14 17H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
                  fill="#4285F4"
                />
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-[#1e3e59] mb-1">{title}</h3>
          <p className="text-xs text-gray-500 mb-2 line-clamp-2">{description}</p>
          <Link
            href={href}
            className="block w-full py-2 text-center text-white bg-[#1e3e59] rounded-md text-xs font-medium hover:bg-[#152d42] transition-colors"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </div>
  );
}

function NoContentCard({ message }: { message: string }) {
  return (
    <div className="w-full flex-shrink-0 flex flex-col items-center justify-center">
      <div className="h-44 flex flex-col items-center justify-center bg-gradient-to-br from-[#f0f4fa] to-[#e9f5f2] rounded-lg border border-dashed border-blue-200 shadow-inner px-8 py-6">
        <div className="mb-4">
          <svg
            width="40"
            height="40"
            viewBox="0 0 48 48"
            fill="none"
            className="mx-auto"
          >
            <circle cx="24" cy="24" r="24" fill="#e0e7ef" />
            <path
              d="M16 32h16M24 16v8M24 28h.01"
              stroke="#7ba6d9"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="text-[#1e3e59] font-semibold text-base mb-2">
          {message}
        </div>
        <div className="text-gray-500 text-xs text-center max-w-xs">
          {message.includes("lesson")
            ? "Start by adding your first lesson to help others learn Baybayin!"
            : "No quizzes available yet. Check back soon or create a new quiz to get started!"}
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="w-full mb-3">
      <div className="bg-gray-200 rounded-lg overflow-hidden shadow-sm border border-blue-200">
        <div className="flex items-center gap-4 p-4">
          <div className="w-16 h-16 bg-[#e9f5f2] flex items-center justify-center rounded-md">
            <Skeleton className="w-10 h-10 rounded-md" />
          </div>
          <div className="flex-1">
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-3 w-40 mb-2" />
            <Skeleton className="h-8 w-full rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SeeMoreButton({ href }: { href: string }) {
  return (
    <div className="flex justify-center mt-2 mb-4">
      <Link
        href={href}
        className="inline-block px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold shadow hover:from-blue-600 hover:to-cyan-600 transition"
      >
        See More
      </Link>
    </div>
  );
}

export function ResponsiveNav() {
  const lessonsStatus = useLearningResourceStore((state) => state.status);
  const lessons = useLearningResourceStore((state) => state.lessons);
  const getAllLessons = useLearningResourceStore((state) => state.getAllLessons);

  const quizzesStatus = useQuizStore((state) => state.status);
  const quizzes = useQuizStore((state) => state.quizzes);
  const loadAllQuiz = useQuizStore((state) => state.loadAllQuiz);

  useEffect(() => {
    if (lessonsStatus !== "Loaded" && lessonsStatus !== "Loading") {
      getAllLessons();
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (quizzesStatus !== "Loaded" && quizzesStatus !== "Loading") {
      loadAllQuiz();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="h-screen overflow-hidden bg-white">
      <div className="h-full overflow-y-auto p-4">
        <div className="max-w-md mx-auto">
          <div className="mb-8 w-full">
            <h2 className="text-lg font-semibold mb-3 text-[#1e3e59] uppercase">
              Guide to Baybayin
            </h2>
            <div className="w-full">
              {lessonsStatus === "Loading" ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : (
                <>
                  {lessons != undefined && lessons.length > 0 ? (
                    lessons.map((lesson) => (
                      <GuideCard
                        key={lesson.title}
                        title={lesson.title}
                        description={lesson.description}
                        href={`/lesson/${lesson.id}`}
                        // image={lesson.image}
                      />
                    ))
                  ) : (
                    <NoContentCard message="No lessons yet" />
                  )}
                  {lessons != undefined &&
                    lessons.length <= 3 &&
                    lessons.length > 0 && (
                      <GuideCard
                        title="Coming Soon"
                        description="New Baybayin lesson on the way. Stay tuned!"
                        href="#"
                        image="/images/baybayin.comingsoon.png"
                        isComingSoon={true}
                      />
                    )}
                </>
              )}
            </div>
            {lessons && lessons.length > 0 && (
              <SeeMoreButton href="/lesson/all" />
            )}
          </div>

          <div className="mb-8 w-full">
            <h2 className="text-lg font-semibold mb-3 text-[#1e3e59] uppercase">
              AI Quiz
            </h2>
            <div className="w-full">
              {quizzesStatus === "Loading" ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : (
                <>
                  {quizzes && quizzes.length > 0 ? (
                    quizzes.map((quiz) => (
                      <QuizCard
                        key={quiz.metadata.quiz_id}
                        title={quiz.metadata.quiz_name}
                        description={quiz.metadata.description ?? "No Description"}
                        href={`/quiz/${quiz.metadata.quiz_id}/view`}
                        // image={quiz.image}
                      />
                    ))
                  ) : (
                    <NoContentCard message="No quizzes yet" />
                  )}
                  {quizzes != undefined &&
                    quizzes.length <= 3 &&
                    quizzes.length > 0 && (
                      <GuideCard
                        title="Coming Soon"
                        description="New Baybayin Quizzes are on their way. Stay tuned!"
                        href="#"
                        image="/images/baybayin.comingsoon.png"
                        isComingSoon={true}
                      />
                    )}
                </>
              )}
            </div>
            {quizzes && quizzes.length > 0 && (
              <SeeMoreButton href="/quiz/all" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}