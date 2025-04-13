import db from "@/db";
import { quiz_answer_question } from "@/db/schema/quiz-schema";

export async function POST(request: Request) {
  const body = await request.json();
  const { answers } = body;
  if (!answers || !Array.isArray(answers)) {
    return new Response("Invalid input", { status: 400 });
  }

  try {
    await db.insert(quiz_answer_question).values(answers);
    return new Response("Answers saved successfully", { status: 200 });
  } catch (error) {
    console.error("Error saving answers:", error);
    return new Response("Error saving answers", { status: 500 });
  }
}
