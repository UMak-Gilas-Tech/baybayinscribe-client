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
export const dynamic = "force-static";

type HandlerParams = { params: { resource_id: string } };

export async function handler(
  req: Request,
  { params }: HandlerParams
): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const resource_id = params.resource_id;
  if (!resource_id) {
    return new Response("Resource ID is required", { status: 400 });
  }

  const body = await req.json();
  const userId = body.userId;

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

  const lessonRow = rows[0].learning_resource;
  const userInfo = await db
    .select()
    .from(user)
    .where(eq(user.id, lessonRow.created_by))
    .then((u) => u[0] || null);

  (lessonRow.created_by as unknown) = userInfo;

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

  return NextResponse.json(lesson, {
    headers: { "Content-Type": "application/json" },
  });
}

// Next.js route handler export
export { handler as POST };
