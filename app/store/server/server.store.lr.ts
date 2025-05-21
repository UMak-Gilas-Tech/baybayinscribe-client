import db from "@/db/drizzle";
import { learningResource } from "@/db/schema/learning-resources";
import { LearningResource } from "@/types/type.lessons";
import { Status } from "@/types/type.loading";
import { desc, eq } from "drizzle-orm";
import { create } from "zustand";

type ServerLrStore = {
  lesson: LearningResource;
  lessons: LearningResource[];
  error: string | undefined;
  status: Status;

  createLesson: (
    lessonName: string,
    lessonDescription: string,
    created_by: string,
    isLessonVisible?: boolean,
  ) => Promise<typeof learningResource.$inferSelect | any>;
  getLesson: (lessonId: string) => Promise<LearningResource>;
  getLessons: () => Promise<void>;
  updateLesson: (lesson: Partial<LearningResource>) => Promise<void>;
  deleteLesson: (lessonId: string) => Promise<void>;
};

export const useServerLrStore = create<ServerLrStore>((set, get) => ({
  lesson: {} as LearningResource,
  lessons: [],
  error: undefined,
  status: "Idle",

  createLesson: async (lessonName, lessonDescription, created_by, isLessonVisible) => {
    set({ status: "Loading" });
    try {
      const lessonCreateRequest = await db
        .insert(learningResource)
        .values({
          id: crypto.randomUUID(),
          title: lessonName,
          description: lessonDescription,
          created_by: created_by,
          is_visible: isLessonVisible ?? false,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      if (lessonCreateRequest.length === 0) {
        throw new Error("Failed to create lesson");
      }

      set({ status: "Loaded" });
      return lessonCreateRequest[0];
    } catch (error) {
      set({ error: (error as Error).message, status: "Error" });
      return { error: (error as Error).message };
    }
  },
  getLesson: async (lessonId) => {
    set({ status: "Loading" });

    const lessonsGetAll = await db
      .select()
      .from(learningResource)
      .where(eq(learningResource.id, lessonId));
    if (lessonsGetAll.length === 0) {
      set({ error: "Lesson not found", status: "Error" });
      throw new Error("Lesson not found");
    }

    set({ lesson: lessonsGetAll[0], status: "Loaded" });
    return lessonsGetAll[0];
  },
  getLessons: async () => {
    set({ status: "Loading" });
    try {
      const lessonsGetAll = await db
        .select()
        .from(learningResource)
        .orderBy(desc(learningResource.createdAt));

      if (lessonsGetAll.length === 0) {
        set({ error: "No lessons found" });
        return;
      }

      set({ lessons: lessonsGetAll, status: "Loaded" });
    } catch (error) {
      set({ error: (error as Error).message, status: "Error" });
    }
  },
  updateLesson: async (lesson) => {
    if (!lesson.id) {
      set({ error: "Lesson ID is required" });
      return;
    }

    set({ status: "Loading" });
    try {
      const lessonUpdateRequest = await db
        .update(learningResource)
        .set({
          ...lesson,
          updatedAt: new Date(),
        })
        .where(eq(learningResource.id, lesson.id))
        .returning();

      if (lessonUpdateRequest.length === 0) {
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
      const lessonDeleteRequest = await db
        .delete(learningResource)
        .where(eq(learningResource.id, lessonId))
        .returning();

      if (lessonDeleteRequest.length === 0) {
        throw new Error("Failed to delete lesson");
      }

      set({ status: "Loaded" });
    } catch (error) {
      set({ error: (error as Error).message, status: "Error" });
    }
  },
}));
