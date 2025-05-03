import db from "@/db";
import {
  learningResource,
  learningResourceModule,
} from "@/db/schema/learning-resources";
import { eq } from "drizzle-orm";

export const dynamic = "force-static";

export async function GET(
  request: Request,
  params: { params: { resource_id: string } }
) {
  const { resource_id } = await params.params;

  if (!resource_id) {
    return new Response("Resource ID is required", { status: 400 });
  }

  // Query the lesson with the joined modules.
  const rows = await db
    .select()
    .from(learningResource)
    .where(eq(learningResource.id, resource_id))
    .leftJoin(
      learningResourceModule,
      eq(learningResource.id, learningResourceModule.learning_resource_id)
    );
    
  if (rows.length === 0) {
    return new Response("Lesson not found", { status: 404 });
  }

  const lesson = {
    ...rows[0],
    learning_resource_module: rows
      .map(row => row.learning_resource_module)
      .filter(module => module) // remove null modules
  };

  return new Response(JSON.stringify(lesson), {
    headers: { "Content-Type": "application/json" },
  });
}
