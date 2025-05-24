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
  getLessons: (userId: string) => Promise<void>;
  getAllLessons: () => Promise<LearningResource[] | Record<string, unknown>[]>;
  updateLesson: (lesson: Partial<LearningResource>) => Promise<void>;
  deleteLesson: (lessonId: string) => Promise<void>;
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
        return response.data;
      } catch (error: unknown) {
        set({ error: (error as Error).message, status: "Error" });
      }
    },
    getLesson: async (lessonId, userId) => {
      set({ status: "Loading" });
      try {
        const response = await axios.post(`/lessons/${lessonId}`, { userId });
        console.log("Lesson data:", response.data);
        set({ lesson: response.data, status: "Loaded" });
        return response.data;
      } catch (error: unknown) {
        set({ error: (error as Error).message, status: "Error" });
      }
    },
    getLessons: async (userId) => {
      set({ status: "Loading" });
      try {
        const response = await axios.post("/lessons/my", { userId });
        set({ lessons: response.data ?? [], status: "Loaded" });
        return response.data;
      } catch (error: unknown) {
        set({ error: (error as Error).message, status: "Error" });
      }
    },
    updateLesson: async (lesson) => {
      set({ status: "Loading" });
      try {
        await axios.put(`/lessons/${lesson.id}/update`, lesson);
        set({ status: "Loaded" });
      } catch (error: unknown) {
        set({ error: (error as Error).message, status: "Error" });
      }
    },
    deleteLesson: async (lessonId) => {
      set({ status: "Loading" });
      try {
        await axios.delete(`/lessons/${lessonId}/delete`);
        set({ status: "Loaded" });
      } catch (error: unknown) {
        set({ error: (error as Error).message, status: "Error" });
      }
    },
    getAllLessons: async () => {
      set({ status: "Loading" });
      try {
        const response = await axios.get("lessons/all");
        set({ lessons: response.data, status: "Loaded" });
        return response.data;
      } catch (error: unknown) {
        set({ error: (error as Error).message, status: "Error" });
      }
    },
  })
);
