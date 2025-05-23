export const revalidate = 60;

import { generateQuiz } from "../../../../lib/genai"
import { NextResponse } from "next/server";
import { QuizDifficulty } from "../../../../types/type.quiz";

export async function GET() {
    const quiz = await generateQuiz(5, "Philippine History", QuizDifficulty.Hard);

    return NextResponse.json(quiz)
}
