"use server"

import { NextResponse } from "next/server";
import db from "../../../../../db";
import { QuizSchema, metadata, quiz_question } from "../../../../../db/schema/quiz-schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { quiz_id: string } }
) {
  const { quiz_id } = await params;
  // Query quiz by id
  const quizRecords = await db
    .select()
    .from(QuizSchema)
    .where(eq(QuizSchema.id, quiz_id))
    .limit(1);
  if (!quizRecords || !quizRecords.length) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }
  const quiz = quizRecords[0];

  // Execute metadata and question queries concurrently
  const [metadataRecords, questions] = await Promise.all([
    db.select().from(metadata).where(eq(metadata.quiz_id, quiz_id)).limit(1),
    db.select().from(quiz_question).where(eq(quiz_question.quiz_id, quiz_id))
  ]);
  const meta = metadataRecords.length ? metadataRecords[0] : null;

  return NextResponse.json({
    quiz,
    metadata: meta,
    questions,
  });
}

export async function generateStaticParams() {
  const quizzes = db.select().from(QuizSchema);
  const quizData = await quizzes;
  const quizIds = quizData
    .map((quiz) => quiz.id)
    .map((id) => ({ quiz_id: id }));
  return quizIds;
}
