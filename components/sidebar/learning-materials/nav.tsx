"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useHomeContext } from "@/app/page";
import { Skeleton } from "@/components/ui/skeleton";

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
    <div className="relative bg-gray-200 rounded-lg overflow-hidden shadow-sm border border-blue-200">
      <div className="relative">
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
        <div className="p-4">
          <h3 className="font-medium text-[#1e3e59] mb-1">{title}</h3>
          <p className="text-xs text-gray-500 mb-4 line-clamp-2">
            {description}
          </p>
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
        <div className="bg-white bg-opacity-80 flex items-center justify-center"></div>
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
}: NavCardProps & { image?: string }) {
  return (
    <div className="bg-gray-200 rounded-lg overflow-hidden shadow-sm border border-blue-200">
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
      <div className="p-4">
        <h3 className="font-medium text-[#1e3e59] mb-1">{title}</h3>
        <p className="text-xs text-gray-500 mb-4 line-clamp-2">{description}</p>
        <Link
          href={href}
          className="block w-full py-2 text-center text-white bg-[#1e3e59] rounded-md text-xs font-medium hover:bg-[#152d42] transition-colors"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
}

export function LearningMaterialsNav() {
  const homeContext = useHomeContext();

  useEffect(() => {
    if (
      !homeContext.lessonsStore.getState().lessons &&
      homeContext.lessonsStore.getState().status === "Loaded"
    )
      return;

    homeContext.lessonsStore.getState().getAllLessons();
  }, []);

  useEffect(() => {
    if (
      !homeContext.quizStore.getState().quizzes &&
      homeContext.quizStore.getState().status === "Loaded"
    )
      return;

    homeContext.quizStore.getState().loadAllQuiz();
  }, []);

  // Determine loading state for lessons and quizzes
  const lessonsLoading =
    homeContext.lessonsStore.getState().status !== "Loaded" ||
    !homeContext.lessonsStore.getState().lessons;
  const quizzesLoading =
    homeContext.quizStore.getState().status !== "Loaded" ||
    !homeContext.quizStore.getState().quizzes;

  // Skeleton card for loading state
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
    <div className="p-4 space-y-4 flex flex-col items-center justify-center">
      <div className="mb-8 w-full">
        <h2 className="text-lg font-semibold mb-3 mt-8 text-[#1e3e59] uppercase">
          Guide to Baybayin
        </h2>
        <div className="overflow-x-auto w-full">
          <div
            className="flex pb-2 space-x-10"
            style={{ width: "max-content" }}
          >
            {lessonsLoading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : (
              <>
                {homeContext.lessonsStore.getState().lessons?.map((lesson) => (
                  <div key={lesson.title} className="w-56 flex-shrink-0">
                    <GuideCard
                      title={lesson.title}
                      description={lesson.description}
                      href={`/lesson/${lesson.id}`}
                      // image={lesson.image}
                    />
                  </div>
                ))}
                {(homeContext.lessonsStore.getState().lessons &&
                  homeContext.lessonsStore.getState().lessons!.length <= 3) && (
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
        <h2 className="text-lg font-semibold mb-3 text-[#1e3e59] uppercase">
          AI Quiz
        </h2>
        <div className="overflow-x-auto">
          <div
            className="flex pb-2 mt-4 space-x-10"
            style={{ width: "max-content" }}
          >
            {quizzesLoading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : (
              <>
                {homeContext.quizStore.getState().quizzes?.map((quiz) => (
                  <div key={quiz.metadata.quiz_id} className="w-56 flex-shrink-0">
                    <QuizCard
                      title={quiz.metadata.quiz_name}
                      description={quiz.metadata.description ?? "No Description"}
                      href={`/quiz/${quiz.metadata.quiz_id}/view`}
                      // image={quiz.image}
                    />
                  </div>
                ))}
                {(homeContext.quizStore.getState().quizzes &&
                  homeContext.quizStore.getState().quizzes!.length <= 3) && (
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
