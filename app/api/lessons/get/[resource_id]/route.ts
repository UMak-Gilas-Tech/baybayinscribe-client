import db from "@/db";
import { learningResource } from "@/db/schema/learning-resources";
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

  const lesson = await db
    .select()
    .from(learningResource)
    .where(eq(learningResource.id, resource_id))
    .then((data) => {
      if (data.length === 0) {
        return new Response("Lesson not found", { status: 404 });
      }
      return new Response(JSON.stringify(data[0]), {
        headers: { "Content-Type": "application/json" },
      });
    });

  return lesson;
}
