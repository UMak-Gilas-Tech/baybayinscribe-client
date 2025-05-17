CREATE TYPE "public"."quiz_difficulty" AS ENUM('Easy', 'Moderate', 'Hard');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'regular');--> statement-breakpoint
CREATE TABLE "file" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"uploaded_by" text,
	"learning_resource_id" uuid,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "learning_resource" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"is_visible" boolean DEFAULT false NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "learning_resource_module" (
	"id" uuid PRIMARY KEY NOT NULL,
	"module_name" text NOT NULL,
	"module_description" text NOT NULL,
	"learning_resource_id" uuid,
	"module_id" uuid,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quiz" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_by" text
);
--> statement-breakpoint
CREATE TABLE "metadata" (
	"quiz_id" uuid PRIMARY KEY NOT NULL,
	"quiz_name" text NOT NULL,
	"description" text,
	"difficulty" "quiz_difficulty" NOT NULL,
	"category" text NOT NULL,
	"time_limit" integer NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quiz_answer_question" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"attempt" integer NOT NULL,
	"quiz_question_id" uuid NOT NULL,
	"quiz_id" uuid NOT NULL,
	"user_answer" text,
	"is_correct" boolean NOT NULL,
	"answered_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quiz_question" (
	"id" uuid PRIMARY KEY NOT NULL,
	"quiz_id" uuid NOT NULL,
	"question_number" integer NOT NULL,
	"type" text NOT NULL,
	"language" text,
	"question" text,
	"options" json,
	"is_options_baybayin" boolean DEFAULT false,
	"is_question_baybayin" boolean DEFAULT false,
	"is_input_baybayin" boolean DEFAULT false,
	"display_text" text,
	"correct_answer" text,
	"character" text,
	"description" text,
	"pairs" json,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "file" ADD CONSTRAINT "file_uploaded_by_user_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "file" ADD CONSTRAINT "file_learning_resource_id_learning_resource_id_fk" FOREIGN KEY ("learning_resource_id") REFERENCES "public"."learning_resource"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_resource_module" ADD CONSTRAINT "learning_resource_module_learning_resource_id_learning_resource_id_fk" FOREIGN KEY ("learning_resource_id") REFERENCES "public"."learning_resource"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_resource_module" ADD CONSTRAINT "learning_resource_module_module_id_file_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."file"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metadata" ADD CONSTRAINT "metadata_quiz_id_quiz_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quiz"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_answer_question" ADD CONSTRAINT "quiz_answer_question_quiz_question_id_quiz_question_id_fk" FOREIGN KEY ("quiz_question_id") REFERENCES "public"."quiz_question"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_answer_question" ADD CONSTRAINT "quiz_answer_question_quiz_id_quiz_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quiz"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_question" ADD CONSTRAINT "quiz_question_quiz_id_quiz_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quiz"("id") ON DELETE cascade ON UPDATE no action;