"use server"

import db from "@/db/drizzle";
import {
  quiz_answer_question,
  quiz_question,
  QuizSchema,
} from "@/db/schema/quiz-schema";
import { asc, eq } from "drizzle-orm";

export async function GET(
  request: Request,
  params: { params: { quiz_id: string } }
) {
  const { quiz_id } = await params.params;

  if (!quiz_id) {
    return new Response("Quiz ID is required", { status: 400 });
  }

  const answers = await db
    .select()
    .from(QuizSchema)
    .leftJoin(
      quiz_answer_question,
      eq(quiz_answer_question.quiz_id, QuizSchema.id)
    )
    .where(eq(QuizSchema.id, quiz_id))
    .orderBy(asc(quiz_answer_question.answered_at));

  return new Response(JSON.stringify(answers), {
    headers: { "Content-Type": "application/json" },
  });
}
