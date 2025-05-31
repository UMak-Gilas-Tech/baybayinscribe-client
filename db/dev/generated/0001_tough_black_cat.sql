ALTER TABLE "quiz_answer_question" ALTER COLUMN "answered_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "quiz_answer_question" ADD COLUMN "user_id" text;--> statement-breakpoint
ALTER TABLE "quiz_answer_question" ADD CONSTRAINT "quiz_answer_question_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;