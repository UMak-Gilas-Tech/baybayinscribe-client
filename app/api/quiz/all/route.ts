import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { metadata, quiz_question, QuizSchema } from "@/db/schema/quiz-schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-static";

export async function GET() {
  try {
    const quizData = await db
      .select({
        metadata: metadata,  
        questionCount: db.$count(db.select().from(quiz_question).where(eq(quiz_question.quiz_id, QuizSchema.id))),
      })
      .from(QuizSchema)
      .leftJoin(metadata, eq(QuizSchema.id, metadata.quiz_id))
      .groupBy(QuizSchema.id, metadata.quiz_id); 

    return NextResponse.json(quizData, { status: 200 });
  } catch (error) {
    console.error("Error fetching quiz data:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch quiz data" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
