"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useLearningResourceStore } from "@/app/store/store.lr";
import { authClient } from "@/app/lib/auth-client";
import { LearningResource, LearningResourceModule } from "@/types/type.lessons";

type LessonContextType = {
  lesson: {
    learning_resource: LearningResource;
    is_visible: boolean;
    learning_resource_module: (LearningResourceModule & {
      is_finished: boolean;
    })[];
    file?: Record<string, unknown>;
  };
  status: string;
  error: string | null;
  setLessonId: (id: string) => void;
};

const LessonContext = createContext<LessonContextType | undefined>(undefined);

export const LessonProvider: React.FC<{
  lessonId: string;
  children: React.ReactNode;
}> = ({ lessonId, children }) => {
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

  const defaultLesson = {
    learning_resource: {} as LearningResource,
    is_visible: false,
    learning_resource_module: [],
    file: undefined
  };

  return (
    <LessonContext.Provider
      value={{ lesson: lesson || defaultLesson, status, error: error || null, setLessonId }}
    >
      {children}
    </LessonContext.Provider>
  );
};

export const useLessonContext = () => {
  const ctx = useContext(LessonContext);
  if (!ctx)
    throw new Error("useLessonContext must be used within a LessonProvider");
  return ctx;
};
