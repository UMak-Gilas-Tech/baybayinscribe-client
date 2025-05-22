"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useLearningResourceStore } from "@/app/store/store.lr";
import { authClient } from "@/app/lib/auth-client";

type LessonContextType = {
  lesson: any;
  status: string;
  error: string | null;
  setLessonId: (id: string) => void;
};

const LessonContext = createContext<LessonContextType | undefined>(undefined);

export const LessonProvider: React.FC<{ lessonId: string; children: React.ReactNode }> = ({
  lessonId,
  children,
}) => {
  const [currentLessonId, setCurrentLessonId] = useState<string>(lessonId);
  const lesson = useLearningResourceStore((s) => s.lesson);
  const status = useLearningResourceStore((s) => s.status);
  const error = useLearningResourceStore((s) => s.error);
  const getLesson = useLearningResourceStore((s) => s.getLesson);

  useEffect(() => {
    (async () => {
      const session = await authClient.getSession();
      if (currentLessonId && session && session.data) {
        getLesson(currentLessonId, session.data.user.id);
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLessonId]);

  const setLessonId = (id: string) => setCurrentLessonId(id);

  return (
    <LessonContext.Provider value={{ lesson, status, error, setLessonId }}>
      {children}
    </LessonContext.Provider>
  );
};

export const useLessonContext = () => {
  const ctx = useContext(LessonContext);
  if (!ctx) throw new Error("useLessonContext must be used within a LessonProvider");
  return ctx;
};
