CREATE TABLE "quiz_answer_question" (
	"id" uuid PRIMARY KEY NOT NULL,
	"quiz_question_id" uuid NOT NULL,
	"user_answer" text,
	"is_correct" boolean NOT NULL,
	"answered_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "quiz_question" RENAME COLUMN "characters" TO "character";--> statement-breakpoint
ALTER TABLE "quiz_answer_question" ADD CONSTRAINT "quiz_answer_question_quiz_question_id_quiz_question_id_fk" FOREIGN KEY ("quiz_question_id") REFERENCES "public"."quiz_question"("id") ON DELETE cascade ON UPDATE no action;