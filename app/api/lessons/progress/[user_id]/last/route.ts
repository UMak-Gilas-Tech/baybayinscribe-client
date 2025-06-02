import db from "@/db/drizzle";
import { learningResourceProgress } from "@/db/schema/learning-resources";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  params: { params: { user_id: string } }
) {
  try {
    const { user_id } = await params.params;
    const query = await db
      .select()
      .from(learningResourceProgress)
      .orderBy(desc(learningResourceProgress.createdAt))
      .where(eq(learningResourceProgress.user_id, user_id))
      .limit(1);

    return NextResponse.json(query[0] || null, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching last progress:", error);
    return NextResponse.json("Failed to fetch last progress: " + error, {
      status: 500,
    });
  }
}
