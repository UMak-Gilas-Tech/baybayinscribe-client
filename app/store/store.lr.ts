import { LearningResource } from "@/types/type.lessons";
import { Status } from "@/types/type.loading";
import { get } from "http";
import { create } from "zustand";

type LearningResourceStore = {
  lesson?: LearningResource;
  lessons: LearningResource[] | undefined;
  error: string | undefined;
  status: Status;

  createLesson: (
    lessonName: string,
    lessonDescription: string
  ) => Promise<void>;
  getLesson: (lessonId: string) => Promise<void>;
  getLessons: () => Promise<void>;
  updateLesson: (lesson: Partial<LearningResource>) => Promise<void>;
  deleteLesson: (lessonId: string) => Promise<void>;
};

export const useLearningResourceStore = create<LearningResourceStore>(
  (set, get) => ({
    lessons: undefined,
    lesson: undefined,
    error: undefined,
    status: "Idle",

    createLesson: async (lessonName, lessonDescription) => {
      set({ status: "Loading" });
      try {
        const lessonCreateRequest = await fetch("/api/lessons/create", {
          method: "POST",
          body: JSON.stringify({
            title: lessonName,
            description: lessonDescription,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!lessonCreateRequest.ok) {
          throw new Error("Failed to create lesson");
        }

        set({ status: "Loaded" });
      } catch (error) {
        set({ error: (error as Error).message, status: "Error" });
      }
    },
    getLesson: async (lessonId) => {
      set({ status: "Loading" });

      const lessonGetRequest = await fetch(`/api/lessons/${lessonId}`);
      if (!lessonGetRequest.ok) {
        set({ error: "Lesson not found" });
        return;
      }
      const lessonData = await lessonGetRequest.json();
      set({ lesson: lessonData, status: "Loaded" });
    },
    getLessons: async () => {
      set({ status: "Loading" });

      const lessonsGetAll = await fetch("/api/lessons/getAll");
      if (!lessonsGetAll.ok) {
        set({ error: "Failed to fetch lessons" });
        return;
      }
      const lessonsData = await lessonsGetAll.json();
      set({ lessons: lessonsData, status: "Loaded" });
    },
    updateLesson: async (lesson) => {
      set({ status: "Loading" });
      try {
        const lessonUpdateRequest = await fetch(
          `/api/lessons/${lesson.id}/update`,
          {
            method: "PUT",
            body: JSON.stringify(lesson),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!lessonUpdateRequest.ok) {
          throw new Error("Failed to update lesson");
        }

        set({ status: "Loaded" });
      } catch (error) {
        set({ error: (error as Error).message, status: "Error" });
      }
    },
    deleteLesson: async (lessonId) => {
      set({ status: "Loading" });
      try {
        const lessonDeleteRequest = await fetch(
          `/api/lessons/${lessonId}/delete`,
          {
            method: "DELETE",
          }
        );

        if (!lessonDeleteRequest.ok) {
          throw new Error("Failed to delete lesson");
        }

        set({ status: "Loaded" });
      } catch (error) {
        set({ error: (error as Error).message, status: "Error" });
      }
    },
  })
);
