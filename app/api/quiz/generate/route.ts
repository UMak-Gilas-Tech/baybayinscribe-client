export const revalidate = 60;

import { generateQuiz } from "../../../../lib/genai"
import { NextResponse } from "next/server";
import { QuizDifficulty } from "../../../../types/type.quiz";
type ResponseData = {};

export async function GET(req: Request) {
    const quiz = await generateQuiz(5, "Philippine History", QuizDifficulty.Hard);

    return NextResponse.json(quiz)
}
