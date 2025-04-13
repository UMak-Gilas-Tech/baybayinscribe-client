import db from "@/db";
import {
  quiz_answer_question,
  quiz_question,
  QuizSchema,
} from "@/db/schema/quiz-schema";
import { asc, eq } from "drizzle-orm";

export async function GET(request: Request) {
  const { quizId } = await request.json();

  if (!quizId) {
    return new Response("Quiz ID is required", { status: 400 });
  }

  const answers = await db
    .select()
    .from(QuizSchema)
    .leftJoin(
      quiz_answer_question,
      eq(quiz_answer_question.quiz_id, QuizSchema.id)
    )
    .where(eq(QuizSchema.id, quizId))
    .orderBy(
      asc(quiz_answer_question.answered_at),
    );

  return new Response(JSON.stringify(answers), {
    headers: { "Content-Type": "application/json" },
  });
}
