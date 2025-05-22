import db from "@/db/drizzle";
import {
  learningResource,
  learningResourceModule,
  learningResourceProgress,
} from "@/db/schema/learning-resources";
import { file as FileSchema } from "@/db/schema/file-schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { user } from "@/db/schema/auth-schema";
import { less } from "@tensorflow/tfjs-core";
export const dynamic = "force-static";

export async function POST(
  request: Request,
  { params }: { params: { resource_id: string } }
) {
  console.log("API handler HIT");
  const resource_id = params.resource_id;
  console.log("resource_id param:", resource_id);

  if (!resource_id) {
    return new Response("Resource ID is required", { status: 400 });
  }

  const body = await request.json();
  const userId = body.userId;
  console.log("Extracted userId from body:", userId);

  if (!userId) {
    console.warn("userId is null. Make sure you are sending it in the POST body as { userId: ... }");
  }

  // Query the lesson with the joined modules and their files.
  const rows = await db
    .select()
    .from(learningResource)
    .where(eq(learningResource.id, resource_id))
    .leftJoin(
      learningResourceModule,
      eq(learningResource.id, learningResourceModule.learning_resource_id)
    )
    .leftJoin(FileSchema, eq(learningResourceModule.module_id, FileSchema.id));

  if (rows.length === 0) {
    return new Response("Lesson not found", { status: 404 });
  }

  // Get the lesson and user info from the first row
  const lessonRow = rows[0].learning_resource;
  const userInfo = await db
    .select()
    .from(user)
    .where(eq(user.id, lessonRow.created_by))
    .then((u) => u[0] || null);

  (lessonRow.created_by as any) = userInfo;

  // Build modules array (resolve files, etc.)
  const modules = await Promise.all(
    rows
      .filter((row) => row.learning_resource_module)
      .map(async (row) => {
        let is_finished = false;
        if (userId && row.learning_resource_module) {
          const progress = await db
            .select()
            .from(learningResourceProgress)
            .where(
              and(
                eq(learningResourceProgress.user_id, userId),
                eq(
                  learningResourceProgress.learning_resource_module_id,
                  row.learning_resource_module.id!
                )
              )
            );

          is_finished = progress.length > 0;
        }

        console.log(row.file)
        return {
          ...row.learning_resource_module,
          file: row.file || null,
          is_finished,
        };
      })
  );

  const lesson = {
    learning_resource: lessonRow,
    learning_resource_module: modules,
  };

  console.log("Lesson data:", lesson);
  return NextResponse.json(lesson, {
    headers: { "Content-Type": "application/json" },
  });
}
