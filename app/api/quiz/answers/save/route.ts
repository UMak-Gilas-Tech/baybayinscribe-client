"use server";

import db from "@/db/drizzle";
import { quiz_answer_question } from "@/db/schema/quiz-schema";
import { eq, desc, and } from "drizzle-orm";

export async function POST(request: Request) {
  const body = await request.json();
  const { answers, user_id } = body;
  if (!answers || !Array.isArray(answers) || answers.length === 0) {
    return new Response("Invalid input", { status: 400 });
  }

  // Get latest attempt number for this quiz
  const quizId = answers[0].quiz_id;
  let latestAttempt = 0;
  try {
    const latest = await db
      .select({ attempt: quiz_answer_question.attempt })
      .from(quiz_answer_question)
      .where(
        and(
          eq(quiz_answer_question.quiz_id, quizId),
          eq(quiz_answer_question.user_id, answers[0].user_id || user_id)
        )
      )
      .orderBy(desc(quiz_answer_question.attempt))
      .limit(1);

    if (latest && latest.length > 0 && typeof latest[0].attempt === "number") {
      latestAttempt = latest[0].attempt;
    }
  } catch (e) {
    latestAttempt = 0;
  }

  const nextAttempt = latestAttempt + 1;

  const processedAnswers = answers.map((a) => ({
    ...a,
    attempt: nextAttempt,
    quiz_id: quizId,
    user_id: user_id || a.user_id, // Use provided user_id or from answer
  }));
  console.log("Processed Answers:", processedAnswers);
  try {
    await db.insert(quiz_answer_question).values(processedAnswers);
    return new Response("Answers saved successfully", { status: 200 });
  } catch (error) {
    console.error("Error saving answers:", error);
    return new Response("Error saving answers", { status: 500 });
  }
}
