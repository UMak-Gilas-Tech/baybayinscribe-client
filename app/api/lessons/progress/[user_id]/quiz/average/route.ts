import { NextRequest, NextResponse } from "next/server";
import db from "@/db/drizzle";
import { quiz_answer_question } from "@/db/schema/quiz-schema";
import { eq, sql } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { user_id: string } }
) {
  try {
    const { user_id } = params;

    if (!user_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get average score across all quizzes for the user
    const result = await db
      .select({
        totalAnswers: sql<number>`COUNT(*)`,
        correctAnswers: sql<number>`SUM(CASE WHEN ${quiz_answer_question.is_correct} THEN 1 ELSE 0 END)`,
        quizzesAnswered: sql<number>`COUNT(DISTINCT ${quiz_answer_question.quiz_id})`,
      })
      .from(quiz_answer_question)
      .where(eq(quiz_answer_question.user_id, user_id));

    const { totalAnswers, correctAnswers, quizzesAnswered } = result[0];

    if (totalAnswers === 0) {
      return NextResponse.json({
        average: 0,
        totalAnswers: 0,
        correctAnswers: 0,
        quizzesAnswered: 0,
        message: "No quiz answers found for this user",
      });
    }

    const average = Math.round((correctAnswers / totalAnswers) * 100);

    return NextResponse.json({
      average,
      totalAnswers,
      correctAnswers,
      quizzesAnswered,
    });
  } catch (error) {
    console.error("Error calculating quiz average:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
