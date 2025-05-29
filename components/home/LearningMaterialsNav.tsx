"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useLearningResourceStore } from "@/app/store/store.lr";
import useQuizStore from "@/app/store/store.quiz";
import { GuideCard } from "./cards/GuideCard";
import { QuizCard } from "./cards/QuizCard";
import { NoContentCard } from "./cards/NoContentCard";
import { SkeletonCard } from "./cards/SkeletonCard";
import { cn } from "@/lib/utils";

function SeeMoreButton({ href }: { href: string }) {
  return (
    <div className="flex justify-center mt-2 mb-4 sm:hidden">
      <Link
        href={href}
        className="inline-block px-6 py-2 rounded-lg bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/90 transition"
      >
        See More
      </Link>
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

  return (
    <div className="h-screen overflow-hidden mx-auto">
      <div className="h-full sm:overflow-y-auto py-9 sm:p-4">
        <div className="max-w-8xl mx-auto">
          <div className="mb-8 w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-semibold mb-3 text-card-foreground uppercase">
                Guide to Baybayin
              </h2>

              <Link
                href="/lesson/all"
                className="hidden sm:block text-xs text-card-foreground font-semibold bg-secondary hover:bg-secondary/90 rounded-md px-4 py-2 transition-colors"
              >
                See more
              </Link>
            </div>
            <div className="sm:overflow-x-auto w-full">
              <div
                className={cn(
                  "flex pb-2 space-x-4 sm:space-x-10",
                  "sm:flex-row flex-col"
                )}
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
                        <div
                          key={lesson.title}
                          className="w-full sm:w-56 flex-shrink-0"
                        >
                          <GuideCard
                            title={lesson.title}
                            description={lesson.description}
                            href={`/lesson/${lesson.id}`}
                          />
                        </div>
                      ))
                    ) : (
                      <NoContentCard message="No lessons yet" />
                    )}
                    {lessons != undefined &&
                      lessons.length <= 3 &&
                      lessons.length > 0 && (
                        <div className="w-full sm:w-56 flex-shrink-0">
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
            {lessons && lessons.length > 0 && (
              <SeeMoreButton href="/lesson/all" />
            )}
          </div>

          <div className="mb-6 w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold mb-3 text-card-foreground uppercase">
                Baybayin Quizzes and Challenges
              </h2>

              <Link
                href="/quiz/all"
                className="hidden sm:block text-xs text-card-foreground font-semibold bg-secondary hover:bg-secondary/90 rounded-md px-4 py-2 transition-colors"
              >
                See more
              </Link>
            </div>
            <div className="sm:overflow-x-auto">
              <div
                className={cn(
                  "w-full flex gap-x-20 pb-2 mt-4 space-x-4 sm:space-x-10",
                  "sm:flex-row flex-col"
                )}
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
                          className="w-full sm:w-56 flex-shrink-0"
                        >
                          <QuizCard
                            title={quiz.metadata.quiz_name}
                            description={
                              quiz.metadata.description ?? "No Description"
                            }
                            href={`/quiz/${quiz.metadata.quiz_id}/view`}
                          />
                        </div>
                      ))
                    ) : (
                      <NoContentCard message="No quizzes yet" />
                    )}
                    {quizzes != undefined &&
                      quizzes.length <= 3 &&
                      quizzes.length > 0 && (
                        <div className="w-full sm:w-56 flex-shrink-0">
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
            {quizzes && quizzes.length > 0 && (
              <SeeMoreButton href="/quiz/all" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
