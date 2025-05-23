import { NextResponse } from "next/server";
import { generateQuiz } from "../../../lib/genai";
import {
  QuizSchema,
  metadata,
  quiz_question,
} from "../../../db/schema/quiz-schema";
import db from "@/db/drizzle";
import { Quiz } from "../../../types/type.quiz";

export const dynamic = "force-static";

async function saveQuizToDB(quiz: Quiz) {
  const quizId = crypto.randomUUID();

  console.log(quiz)

  // Insert master quiz record
  await db.insert(QuizSchema).values({ 
    id: quizId,
    created_by: "" // Add a default created_by value or pass from the request
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
    const { question_count, topic, difficulty, quiz_name } =
      await request.json();

    if (!question_count || !topic || !difficulty) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const quiz = await generateQuiz(
      Number(question_count),
      topic,
      difficulty,
      quiz_name
    );

    const savedQuiz = await saveQuizToDB(quiz);

    return NextResponse.json(savedQuiz);
  } catch (error: unknown) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

