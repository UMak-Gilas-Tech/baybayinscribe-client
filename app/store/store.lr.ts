import axios from "@/lib/axios";
import { LearningResource } from "@/types/type.lessons";
import { Status } from "@/types/type.loading";
import { create } from "zustand";

export type LearningResourceStore = {
  lesson?: LearningResource;
  lessons: LearningResource[] | undefined;
  error: string | undefined;
  status: Status;

  createLesson: (
    lessonName: string,
    lessonDescription: string,
    created_by: string,
    isLessonVisible?: boolean
  ) => Promise<LearningResource | Record<string, unknown>>;
  getLesson: (
    lessonId: string,
    userId?: string
  ) => Promise<
    | (LearningResource & { file?: Record<string, unknown> })
    | Record<string, unknown>[]
  >;
  getMyLessons: (userId: string) => Promise<void>;
  getAllLessons: () => Promise<LearningResource[] | Record<string, unknown>[]>;
  updateLesson: (lesson: Partial<LearningResource>) => Promise<void>;
  deleteLesson: (lessonId: string) => Promise<void>;
  clearUserLessonProgress: (userId: string) => Promise<void>;
  getLastLessonProgress: (userId: string) => Promise<LearningResource | null>;
};

export const useLearningResourceStore = create<LearningResourceStore>(
  (set) => ({
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
        const response = await axios.post("/lessons/create", {
          title: lessonName,
          description: lessonDescription,
          created_by: created_by,
          is_visible: isLessonVisible,
        });
        set({ status: "Loaded" });
        if (!response.data) return undefined;
        return response.data;
      } catch (error: unknown) {
        set({ error: (error as Error).message, status: "Error" });
        return undefined;
      }
    },
    getLesson: async (lessonId, userId) => {
      set({ status: "Loading" });
      try {
        const response = await axios.post(`/lessons/${lessonId}`, { userId });
        console.log("Lesson data:", response.data);
        if (!response.data) {
          set({ lesson: undefined, status: "Loaded" });
          return undefined;
        }
        set({ lesson: response.data, status: "Loaded" });
        return response.data;
      } catch (error: unknown) {
        set({ error: (error as Error).message, status: "Error" });
        return undefined;
      }
    },
    getMyLessons: async (userId) => {
      set({ status: "Loading" });
      try {
        const response = await axios.post("/lessons/my", { userId });
        if (!response.data || response.data.length === 0) {
          set({ lessons: [], status: "Loaded" });
          return [];
        }
        set({ lessons: response.data ?? [], status: "Loaded" });
        return response.data;
      } catch (error: unknown) {
        set({ error: (error as Error).message, status: "Error" });
        set({ lessons: [], status: "Error" });
        return [];
      }
    },
    updateLesson: async (lesson) => {
      set({ status: "Loading" });
      try {
        const response = await axios.put(
          `/lessons/${lesson.id}/update`,
          lesson
        );
        if (!response?.data) {
          set({ status: "Loaded" });
          return;
        }
        set({ status: "Loaded" });
      } catch (error: unknown) {
        set({ error: (error as Error).message, status: "Error" });
      }
    },
    deleteLesson: async (lessonId) => {
      set({ status: "Loading" });
      try {
        const response = await axios.delete(`/lessons/${lessonId}/delete`);
        if (!response?.data) {
          set({ status: "Loaded" });
          return;
        }
        set({ status: "Loaded" });
      } catch (error: unknown) {
        set({ error: (error as Error).message, status: "Error" });
      }
    },
    getAllLessons: async () => {
      set({ status: "Loading" });
      try {
        const response = await axios.get("lessons/all");
        if (!response.data || response.data.length === 0) {
          set({ lessons: [], status: "Loaded" });
          return [];
        }
        set({ lessons: response.data, status: "Loaded" });
        return response.data;
      } catch (error: unknown) {
        set({ error: (error as Error).message, status: "Error" });
        return [];
      }
    },

    clearUserLessonProgress: async (userId) => {
      try {
        const response = await axios.post(`/lessons/progress/${userId}/clear`);

        if (response.status === 200) {
          return response.data;
        }

        throw new Error("Failed to clear progress");
      } catch (error: unknown) {
        console.error("Error clearing user lesson progress:", error);
        throw new Error((error as Error).message || "Failed to clear progress");
      }
    },

    getLastLessonProgress: async (userId) => {
      try {
        const response = await axios.get(`/lessons/progress/${userId}/last`);

        if (response.status === 200) {
          return response.data;
        }
        return null;
      } catch (error: unknown) {
        console.error("Error fetching last lesson progress:", error);
        return null;
      }
    },
  })
);
