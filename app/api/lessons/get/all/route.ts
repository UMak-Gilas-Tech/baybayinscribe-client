"use server";

import db from "@/db";
import { learningResource } from "@/db/schema/learning-resources";
import { desc } from "drizzle-orm";

export const dynamic = "force-static";

export async function GET(request: Request) {
  const lessons = await db
    .select()
    .from(learningResource)
    .orderBy(desc(learningResource.createdAt))
    .then((data) => {
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      });
    });

  return lessons;
}
