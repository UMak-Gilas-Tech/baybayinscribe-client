import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { QuizSchema, metadata, quiz_question } from "@/db/schema/quiz-schema";
import { Quiz } from "@/types/type.quiz";
import { eq } from "drizzle-orm";

async function saveQuizToDB(quiz: Quiz, created_by: string, id?: string) {
  const quizId = id ?? crypto.randomUUID();

  try {
    console.log("Saving quiz to DB:", quiz);

    const doesQuizExist = await db
      .select()
      .from(QuizSchema)
      .where(eq(QuizSchema.id, quizId));

    // Fix: should check if length === 0 for non-existent quiz
    if (doesQuizExist.length === 0) {
      // Insert master quiz record
      const quizInsertResult = await db.insert(QuizSchema).values({
        id: quizId,
        created_by: created_by,
      });
      console.log("QuizSchema insert result:", quizInsertResult);

      // Insert quiz metadata record
      const metadataInsertResult = await db.insert(metadata).values({
        quiz_id: quizId,
        quiz_name: quiz.metadata.quiz_name,
        difficulty: quiz.metadata.difficulty,
        category: quiz.metadata.category,
        description: quiz.metadata.description,
        is_public: quiz.metadata.is_public,
        time_limit: quiz.metadata.time_limit || 30,
        created_at: new Date(),
        updated_at: new Date(),
      });
      console.log("Metadata insert result:", metadataInsertResult);

      // Insert each quiz question (if any)
      if (quiz.questions && Array.isArray(quiz.questions)) {
        for (const q of quiz.questions) {
          const questionInsertResult = await db.insert(quiz_question).values({
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
          console.log("Quiz question insert result:", questionInsertResult);
        }
      }
    } else {
      // Update existing quiz metadata
      const metadataUpdateResult = await db
        .update(metadata)
        .set({
          quiz_name: quiz.metadata.quiz_name,
          difficulty: quiz.metadata.difficulty,
          description: quiz.metadata.description,
          is_public: quiz.metadata.is_public,
          category: quiz.metadata.category,
          time_limit: quiz.metadata.time_limit || 30, // fallback time limit if not provided
          updated_at: new Date(),
        })
        .where(eq(metadata.quiz_id, quizId));
      console.log("Metadata update result:", metadataUpdateResult);

      // Update each quiz question (if any)
      if (quiz.questions && Array.isArray(quiz.questions)) {
        for (const q of quiz.questions) {
          if (!q.id || q.id == "") {
            // Insert as new question if id is missing/null
            const questionInsertResult = await db.insert(quiz_question).values({
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
              created_at: q.created_at ? new Date(q.created_at) : new Date(),
              updated_at: new Date(),
            });
            console.log("Quiz question insert result (update branch):", questionInsertResult);
          } else {
            const questionUpdateResult = await db
              .update(quiz_question)
              .set({
                // id: q.id, // Do not update primary key!
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
                created_at: q.created_at ? new Date(q.created_at) : new Date(),
                updated_at: new Date(),
              })
              .where(eq(quiz_question.id, q.id));
            console.log("Quiz question update result:", questionUpdateResult);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error saving quiz to DB:", error);
    // Throw error to be caught by the POST handler
    throw new Error("Failed to save quiz to database");
  }

  return { quizId, message: "Quiz saved successfully" };
}

export async function POST(request: Request) {
  try {
    const quiz: Quiz & { id?: string; created_by?: string } =
      await request.json();

    if (!quiz || !quiz.metadata || !quiz.questions) {
      return NextResponse.json(
        { error: "Invalid quiz structure." },
        { status: 400 }
      );
    }

    const savedQuiz = await saveQuizToDB(
      { metadata: quiz.metadata, questions: quiz.questions },
      quiz.created_by || "system",
      quiz.id
    );

    return NextResponse.json(
      { ...savedQuiz, metadata: quiz.metadata, questions: quiz.questions },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("API error:", error);
    // Always return error as JSON with 500 status
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
