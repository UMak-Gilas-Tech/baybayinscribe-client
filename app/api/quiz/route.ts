import { NextResponse } from "next/server";
import { generateQuiz } from "../../../lib/genai";
import {
  QuizSchema,
  metadata,
  quiz_question,
} from "../../../db/schema/quiz-schema";
import db from "@/db/drizzle";
import { Quiz } from "../../../types/type.quiz";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

async function saveQuizToDB(quiz: Quiz, created_by: string) {
  const quizId = crypto.randomUUID();

  console.log(quiz);

  // Insert master quiz record
  await db.insert(QuizSchema).values({
    id: quizId,
    created_by: created_by,
  });

  // Insert quiz metadata record
  await db.insert(metadata).values({
    quiz_id: quizId,
    quiz_name: quiz.metadata.quiz_name,
    difficulty: quiz.metadata.difficulty,
    category: quiz.metadata.category,
    time_limit: quiz.metadata.time_limit || 30, // fallback time limit if not provided
    created_at: new Date(),
    updated_at: new Date(),
  });

  // Insert each quiz question (if any)
  if (quiz.questions && Array.isArray(quiz.questions)) {
    for (const q of quiz.questions) {
      await db.insert(quiz_question).values({
        id: crypto.randomUUID(),
        quiz_id: quizId,
        question_number: q.question_number,
        type: q.type,
        language: q.language,
        question: q.question,
        options: q.options,
        display_text: q.display_text,
        correct_answer: q.correct_answer,
        character: q.character,
        description: q.description,
        pairs: q.pairs,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
  }

  return { quizId, message: "Quiz saved successfully" };
}

export async function POST(request: Request) {
  try {
    const { question_count, topic, difficulty, quiz_name, created_by } =
      await request.json();

    if (!question_count || !topic || !difficulty) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    if (!created_by) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    const quiz = await generateQuiz(
      Number(question_count),
      topic,
      difficulty,
      quiz_name
    );

    const savedQuiz = await saveQuizToDB(quiz, created_by);

    return NextResponse.json(savedQuiz);
  } catch (error: unknown) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { quizId } = await request.json();
    if (!quizId) {
      return NextResponse.json(
        { error: "Quiz ID is required." },
        { status: 400 }
      );
    }

    // Delete quiz metadata and questions based on quizId
    await db.delete(metadata).where(eq(metadata.quiz_id, quizId));
    await db.delete(quiz_question).where(eq(quiz_question.quiz_id, quizId));
    await db.delete(QuizSchema).where(eq(QuizSchema.id, quizId));
    return NextResponse.json({ message: "Quiz deleted successfully" });
  } catch (error: unknown) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
