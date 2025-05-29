"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useHomeContext } from "@/app/page";
import { Skeleton } from "@/components/ui/skeleton";
import { useLearningResourceStore } from "@/app/store/store.lr";
import useQuizStore from "@/app/store/store.quiz";

interface NavCardProps {
  title: string;
  description: string;
  href: string;
  buttonText?: string;
}

function GuideCard({
  title,
  description,
  href,
  buttonText = "Start Learning",
  image,
  isComingSoon = false,
}: NavCardProps & { image?: string; isComingSoon?: boolean }) {
  return (
    <div
      className={`relative bg-gray-200 rounded-lg overflow-hidden shadow-sm ${!isComingSoon ? "border border-blue-200" : "border-dashed border-2 border-blue-200 opacity-30"} h-full flex flex-col`}
    >
      <div className="flex-1 flex flex-col">
        <div className="relative h-44 bg-[#e9f5f2] flex items-center justify-center p-4">
          {image ? (
            <div className="relative w-full h-full">
              <Image
                src={image}
                alt={title}
                className="object-contain"
                fill
                sizes="(max-width: 768px) 100vw, 224px"
              />
            </div>
          ) : (
            <div className="w-12 h-12 flex items-center justify-center">
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
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-medium text-[#1e3e59] mb-2">{title}</h3>
          <p className="text-xs text-gray-500 mb-6 line-clamp-2 flex-1">
            {description}
          </p>
          <div className="mt-auto">
            <Link
              href={href}
              className={`block w-full py-2 text-center text-white rounded-md text-xs font-medium transition-colors ${
                isComingSoon
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#1e3e59] hover:bg-[#152d42]"
              }`}
              tabIndex={isComingSoon ? -1 : 0}
              aria-disabled={isComingSoon}
            >
              {buttonText}
            </Link>
          </div>
        </div>
      </div>
      {isComingSoon && (
        <div className="bg-white bg-opacity-80 flex items-center justify-center absolute inset-0 "></div>
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
  isComingSoon = false,
}: NavCardProps & { image?: string; isComingSoon?: boolean }) {
  return (
    <div className="bg-gray-200 rounded-lg overflow-hidden shadow-sm border border-blue-200 h-full flex flex-col relative">
      <div className="relative h-44 bg-[#e9f5f2] flex items-center justify-center p-4">
        {image ? (
          <div className="relative w-full h-full">
            <Image
              src={image}
              alt={title}
              className="object-contain"
              fill
              sizes="(max-width: 768px) 100vw, 224px"
            />
          </div>
        ) : (
          <div className="w-12 h-12 flex items-center justify-center">
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
      <div className="relative p-4 flex flex-col flex-1">
        <h3 className="font-medium text-[#1e3e59] mb-2">{title}</h3>
        <p className="text-xs text-gray-500 mb-6 line-clamp-2">{description}</p>
        <div className="mt-auto">
          <Link
            href={href}
            className={`block w-full py-2 text-center text-white rounded-md text-xs font-medium transition-colors ${
              isComingSoon
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#1e3e59] hover:bg-[#152d42]"
            }`}
            tabIndex={isComingSoon ? -1 : 0}
            aria-disabled={isComingSoon}
          >
            {buttonText}
          </Link>
        </div>
      </div>
      {isComingSoon && (
        <div className="bg-white bg-opacity-80 flex items-center justify-center absolute inset-0">

        </div>
      )}
    </div>
  );
}

// Add NoContentCard for empty state
function NoContentCard({ message }: { message: string }) {
  return (
    <div className="w-full flex-shrink-0">
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

export function LearningMaterialsNav() {
  const lessonsStatus = useLearningResourceStore((state) => state.status);
  const lessons = useLearningResourceStore((state) => state.lessons);
  const getAllLessons = useLearningResourceStore(
    (state) => state.getAllLessons
  );

  const quizzesStatus = useQuizStore((state) => state.status);
  const quizzes = useQuizStore((state) => state.quizzes);
  const loadAllQuiz = useQuizStore((state) => state.loadAllQuiz);

  // Load lessons and quizzes on mount if not loaded
  useEffect(() => {
    if (lessonsStatus !== "Loaded" && lessonsStatus !== "Loading") {
      getAllLessons();
    }
    // eslint-disable-next-line
  }, [lessonsStatus]);

  useEffect(() => {
    if (quizzesStatus !== "Loaded" && quizzesStatus !== "Loading") {
      loadAllQuiz();
    }
    // eslint-disable-next-line
  }, [quizzesStatus]);

  function SkeletonCard() {
    return (
      <div className="w-56 flex-shrink-0">
        <div className="bg-gray-200 rounded-lg overflow-hidden shadow-sm border border-blue-200">
          <div className="relative h-44 bg-[#e9f5f2] flex items-center justify-center p-4">
            <Skeleton className="w-20 h-20 rounded-md" />
          </div>
          <div className="p-4">
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-3 w-40 mb-4" />
            <Skeleton className="h-8 w-full rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 w-full flex flex-col">
      <div className="mb-8 w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold mb-3 text-[#1e3e59] uppercase">
            Guide to Baybayin
          </h2>

          <Link
            href="/lesson/all"
            className="text-xs text-[#1e3e59] font-semibold bg-[#e9f5f2] hover:bg-[#d1e7dd] rounded-md px-4 py-2 transition-colors"
          >
            See more
          </Link>
        </div>
        <div className="overflow-x-auto w-full">
          <div
            className="flex pb-2 space-x-10"
            style={{ width: "max-content" }}
          >
            {lessonsStatus === "Loading" ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : (
              <>
                {lessons != undefined && lessons.length > 0 ? (
                  lessons.map((lesson) => (
                    <div key={lesson.title} className="w-56 flex-shrink-0">
                      <GuideCard
                        title={lesson.title}
                        description={lesson.description}
                        href={`/lesson/${lesson.id}`}
                        // image={lesson.image}
                      />
                    </div>
                  ))
                ) : (
                  <NoContentCard message="No lessons yet" />
                )}
                {lessons != undefined &&
                  lessons.length <= 3 &&
                  lessons.length > 0 && (
                    <div className="w-56 flex-shrink-0">
                      <GuideCard
                        title="Coming Soon"
                        description="New Baybayin lesson on the way. Stay tuned!"
                        href="#"
                        image="/images/baybayin.comingsoon.png"
                        isComingSoon={true}
                      />
                    </div>
                  )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6 w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold mb-3 text-[#1e3e59] uppercase">
            Baybayin Quizzes and Challenges
          </h2>

          <Link
            href="/quiz/all"
            className="text-xs text-[#1e3e59] font-semibold bg-[#e9f5f2] hover:bg-[#d1e7dd] rounded-md px-4 py-2 transition-colors"
          >
            See more
          </Link>
        </div>
        <div className="overflow-x-auto">
          <div
            className="flex pb-2 mt-4 space-x-10"
            style={{ width: "max-content" }}
          >
            {quizzesStatus === "Loading" ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : (
              <>
                {quizzes && quizzes.length > 0 ? (
                  quizzes.map((quiz) => (
                    <div
                      key={quiz.metadata.quiz_id}
                      className="w-56 flex-shrink-0"
                    >
                      <QuizCard
                        title={quiz.metadata.quiz_name}
                        description={
                          quiz.metadata.description ?? "No Description"
                        }
                        href={`/quiz/${quiz.metadata.quiz_id}/view`}
                        // image={quiz.image}
                      />
                    </div>
                  ))
                ) : (
                  <NoContentCard message="No quizzes yet" />
                )}
                {quizzes != undefined &&
                  quizzes.length <= 3 &&
                  quizzes.length > 0 && (
                    <div className="w-56 flex-shrink-0">
                      <GuideCard
                        title="Coming Soon"
                        description="New Baybayin Quizzes are on their way. Stay tuned!"
                        href="#"
                        image="/images/baybayin.comingsoon.png"
                        isComingSoon={true}
                      />
                    </div>
                  )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
