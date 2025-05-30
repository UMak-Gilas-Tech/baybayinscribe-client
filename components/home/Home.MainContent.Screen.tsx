"use client";

import React, { useEffect } from "react";
import { useLearningResourceStore } from "@/app/store/store.lr";
import useQuizStore from "@/app/store/store.quiz";
import { GuideCard } from "./cards/GuideCard";
import { QuizCard } from "./cards/QuizCard";
import { Quiz } from "@/types/type.quiz";
import { ContentSection } from "./Home.Section.Content";

interface Lesson {
  title: string;
  id: string;
  created_by: string;
  description: string;
  is_visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function HomeMainContentScreen() {
  const lessonsStatus = useLearningResourceStore((state) => state.status);
  const lessons = useLearningResourceStore((state) => state.lessons);
  const getAllLessons = useLearningResourceStore(
    (state) => state.getAllLessons
  );

  const quizzesStatus = useQuizStore((state) => state.status);
  const quizzes = useQuizStore((state) => state.quizzes);
  const loadAllQuiz = useQuizStore((state) => state.loadAllQuiz);

  useEffect(() => {
    if (lessonsStatus !== "Loaded" && lessonsStatus !== "Loading") {
      getAllLessons();
    }
  }, [lessonsStatus, getAllLessons]);

  useEffect(() => {
    if (quizzesStatus !== "Loaded" && quizzesStatus !== "Loading") {
      loadAllQuiz();
    }
  }, [quizzesStatus, loadAllQuiz]);

  return (
    <main className="min-h-screen max-w-8xl mx-auto pb-6">
      <ContentSection<Lesson>
        title="Guide to Baybayin"
        seeMoreHref="/lesson/all"
        isLoading={lessonsStatus === "Loading"}
        items={lessons}
        renderItem={(lesson) => (
          <article
            key={lesson.title}
            className="w-full sm:max-w-[300px] flex-shrink-0"
          >
            <GuideCard
              title={lesson.title}
              description={lesson.description}
              href={`/lesson/${lesson.id}`}
            />
          </article>
        )}
        emptyMessage="No lessons yet"
      />

      <ContentSection<Quiz>
        title="Baybayin Quizzes and Challenges"
        seeMoreHref="/quiz/all"
        isLoading={quizzesStatus === "Loading"}
        items={quizzes}
        renderItem={(quiz) => (
          <article
            key={quiz.metadata.quiz_id}
            className="w-full h-full sm:max-w-[300px] min-h-fit flex-shrink-0 overflow-auto pt-3"
          >
            <QuizCard
              title={quiz.metadata.quiz_name}
              description={quiz.metadata.description ?? "No Description"}
              href={`/quiz/${quiz.metadata.quiz_id}/view`}
            />
          </article>
        )}
        emptyMessage="No quizzes yet"
        className="mb-6"
      />
    </main>
  );
}
