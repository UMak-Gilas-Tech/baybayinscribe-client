import db from "@/db/drizzle";
import {
  learningResource,
  learningResourceModule,
} from "@/db/schema/learning-resources";
import { file as FileSchema } from "@/db/schema/file-schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET(
  request: Request,
  params: { params: { resource_id: string } }
) {
  const { resource_id } = await params.params;

  if (!resource_id) {
    return new Response("Resource ID is required", { status: 400 });
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
    .leftJoin(
      FileSchema,
      eq(learningResourceModule.module_id, FileSchema.id)
    );

  if (rows.length === 0) {
    return new Response("Lesson not found", { status: 404 });
  }

  const lesson = {
    ...rows[0],
    learning_resource_module: rows
      .map((row: (typeof rows)[0]) => {
        if (!row.learning_resource_module) return null;
        // Append file to the module object directly
        return {
          ...row.learning_resource_module,
          file: row.file || null,
        };
      })
      .filter(
        (module: unknown): module is NonNullable<typeof module> =>
          module !== null
      ),
  };

  console.log("Getting Lessons...")

  return NextResponse.json(lesson, {
    headers: { "Content-Type": "application/json" },
  });
}
