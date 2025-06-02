"use server";

import db from "@/db/drizzle";
import { learningResourceProgress } from "@/db/schema/learning-resources";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  params: { params: { user_id: string } }
) {
  try {
    const { user_id } = await params.params;
    console.log("Clearing progress for user:", user_id);
    await db
      .delete(learningResourceProgress)
      .where(eq(learningResourceProgress.user_id, user_id));
    return NextResponse.json("Progress cleared successfully", { status: 200 });
  } catch (error) {
    console.error("Error clearing progress:", error);
    return NextResponse.json("Failed to clear progress: " + error, {
      status: 500,
    });
  }
}
