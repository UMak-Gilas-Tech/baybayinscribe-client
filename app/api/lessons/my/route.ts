import db from "@/db/drizzle";
import {
    learningResource,
    learningResourceModule
} from "@/db/schema/learning-resources";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { userId } = await request.json();

  if (!userId) {
    return NextResponse.json(
      { error: "User ID is required." },
      { status: 400 }
    );
  }

  const userLessons = await db
    .select()
    .from(learningResource)
    .where(eq(learningResource.created_by, userId));

  // For each lesson, fetch its modules and attach under "modules"
  const lessonsWithModules = await Promise.all(
    userLessons.map(async (lesson) => {
      const lessonId = lesson.id;
      const modules = await db
        .select()
        .from(learningResourceModule)
        .where(eq(learningResourceModule.learning_resource_id, lessonId));
      return {
        ...lesson,
        modules,
      };
    })
  );

  if (lessonsWithModules.length === 0) {
    return NextResponse.json(
      { message: "No lessons found for this user." },
    );
  }

  return NextResponse.json(lessonsWithModules, { status: 200 });
}
