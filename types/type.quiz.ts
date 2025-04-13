import { metadata, quiz_question } from "../db/schema/quiz-schema"
export enum QuizDifficulty {
  Easy = "Easy",
  Moderate = "Moderate",
  Hard = "Hard",
}

export type QuizMetadata = typeof metadata.$inferSelect;

export enum QuestionType {
  MCQ = "MCQ",
  IDT = "IDT",
  SKT = "SKT",
}

export type QuizQuestion = typeof quiz_question.$inferInsert;

export type WordMatchingPair = {
  baybayin: string;
  latin: string;
};

export type Quiz = {
  metadata: QuizMetadata;
  questions: QuizQuestion[];
};
