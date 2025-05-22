import db from "@/db/drizzle";
import {
  learningResourceModule,
  learningResourceProgress,
} from "@/db/schema/learning-resources";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { resource_id: string; module_id: string } }
) {
  try {
    const { resource_id, module_id } = await params;
    const body = await request.json();

    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const lrModuleQuery = await db
      .select()
      .from(learningResourceProgress)
      .where(
        and(
          eq(learningResourceProgress.user_id, userId),
          eq(learningResourceProgress.learning_resource_module_id, module_id)
        )
      );

    if (lrModuleQuery.length === 0) {
      const insertQuery = await db
        .insert(learningResourceProgress)
        .values({
          user_id: userId,
          learning_resource_module_id: module_id,
          progress: "100",
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return NextResponse.json(insertQuery[0], { status: 201 });
    } else {
      return NextResponse.json(
        { message: "Module already finished" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error finishing module:", error);
    return NextResponse.json(
      { error: "Failed to finish module" },
      { status: 500 }
    );
  }
}
