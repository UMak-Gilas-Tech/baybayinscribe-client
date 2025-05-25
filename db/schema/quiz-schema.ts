import { uuid, boolean } from "drizzle-orm/pg-core";
import {
  pgTable,
  text,
  integer,
  timestamp,
  json,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { user } from "./auth-schema";

export const quizDifficultyEnum = pgEnum("quiz_difficulty", [
  "Easy",
  "Moderate",
  "Hard",
]);

export const QuizSchema = pgTable("quiz", {
  id: uuid("id").primaryKey(),
  created_by: text("created_by").references(() => user.id),
});

export const metadata = pgTable("metadata", {
  quiz_id: uuid("quiz_id")
    .primaryKey()
    .references(() => QuizSchema.id, { onDelete: "cascade" }),
  quiz_name: text("quiz_name").notNull(),
  description: text("description"),
  is_public: boolean("is_public").default(false),
  difficulty: quizDifficultyEnum("difficulty").notNull(),
  category: text("category").notNull(),
  time_limit: integer("time_limit").notNull(),
  created_at: timestamp("created_at").notNull(),
  updated_at: timestamp("updated_at").notNull(),
});

export const quiz_question = pgTable("quiz_question", {
  id: uuid("id").primaryKey(),
  quiz_id: uuid("quiz_id")
    .notNull()
    .references(() => QuizSchema.id, { onDelete: "cascade" }),
  question_number: integer("question_number").notNull(),
  type: text("type").notNull(),
  language: text("language"),
  question: text("question"),
  options: json("options"),
  is_options_baybayin: boolean("is_options_baybayin").default(false),
  is_question_baybayin: boolean("is_question_baybayin").default(false),
  is_input_baybayin: boolean("is_input_baybayin").default(false),
  display_text: text("display_text"),
  correct_answer: text("correct_answer"),
  character: text("character"),
  description: text("description"),
  pairs: json("pairs"),
  created_at: timestamp("created_at").notNull(),
  updated_at: timestamp("updated_at").notNull(),
});

export const quiz_answer_question = pgTable("quiz_answer_question", {
  id: uuid("id").defaultRandom().primaryKey(),
  attempt: integer("attempt").notNull(),
  user_id: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  quiz_question_id: uuid("quiz_question_id")
    .notNull()
    .references(() => quiz_question.id, { onDelete: "cascade" }),
  quiz_id: uuid("quiz_id")
    .notNull()
    .references(() => QuizSchema.id, { onDelete: "cascade" }),
  user_answer: text("user_answer"),
  is_correct: boolean("is_correct").notNull(),
  answered_at: timestamp("answered_at", { withTimezone: true, mode: "string" })
    .$onUpdate(() => sql`NOW()`)
    .notNull(),
});

export const quizRelations = relations(QuizSchema, ({ one, many }) => ({
  metadata: one(metadata, {
    fields: [QuizSchema.id],
    references: [metadata.quiz_id],
  }),
  questions: many(quiz_question),
}));

export const quizQuestionRelations = relations(quiz_question, ({ one }) => ({
  quiz: one(QuizSchema, {
    fields: [quiz_question.quiz_id],
    references: [QuizSchema.id],
  }),
}));
