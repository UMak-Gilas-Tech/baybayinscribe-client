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
    lessonDescription: string,
    created_by: string,
    isLessonVisible?: boolean
  ) => Promise<LearningResource | any>;
  getLesson: (
    lessonId: string
  ) => Promise<(LearningResource & { file?: any }) | any>;
  getLessons: (userId: string) => Promise<void>;
  updateLesson: (lesson: Partial<LearningResource>) => Promise<void>;
  deleteLesson: (lessonId: string) => Promise<void>;
};

export const useLearningResourceStore = create<LearningResourceStore>(
  (set, get) => ({
    lessons: undefined,
    lesson: undefined,
    error: undefined,
    status: "Idle",

    createLesson: async (
      lessonName,
      lessonDescription,
      created_by,
      isLessonVisible
    ) => {
      set({ status: "Loading" });
      try {
        const lessonCreateRequest = await fetch("/api/lessons/create", {
          method: "POST",
          body: JSON.stringify({
            title: lessonName,
            description: lessonDescription,
            created_by: created_by,
            is_visible: isLessonVisible,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!lessonCreateRequest.ok) {
          throw new Error("Failed to create lesson");
        }

        set({ status: "Loaded" });

        return await lessonCreateRequest.json();
      } catch (error) {
        set({ error: (error as Error).message, status: "Error" });
      }
    },
    getLesson: async (lessonId) => {
      set({ status: "Loading" });
      try {
        const lessonGetRequest = await fetch(`/api/lessons/${lessonId}`);
        if (!lessonGetRequest.ok) {
          set({ error: "Lesson not found", status: "Error" });
          return;
        }
        const lessonData = await lessonGetRequest.json();
        console.log("Lesson data:", lessonData);
        set({ lesson: lessonData, status: "Loaded" });
        return lessonData;
      } catch (error) {
        set({ error: (error as Error).message, status: "Error" });
      }
    },
    getLessons: async (userId) => {
      set({ status: "Loading" });
      try {
        const lessonsGetAll = await fetch("/api/lessons/my", {
          method: "POST",
          body: JSON.stringify({ userId }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!lessonsGetAll.ok) {
          set({ error: "Failed to fetch lessons", status: "Error" });
          return;
        }
        const lessonsData = await lessonsGetAll.json();
        set({ lessons: lessonsData, status: "Loaded" });
        return lessonsData;
      } catch (error) {
        set({ error: (error as Error).message, status: "Error" });
      }
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
