CREATE TYPE "public"."quiz_difficulty" AS ENUM('Easy', 'Moderate', 'Hard');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'regular');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jwks" (
	"id" text PRIMARY KEY NOT NULL,
	"public_key" text NOT NULL,
	"private_key" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	"banned" boolean DEFAULT false NOT NULL,
	"ban_reason" text,
	"ban_expires" date,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_information" (
	"user_id" text PRIMARY KEY NOT NULL,
	"username" varchar(30) NOT NULL,
	"first_name" varchar(30) NOT NULL,
	"last_name" varchar(30) NOT NULL,
	"contact_number" varchar(15) NOT NULL,
	"date_of_birth" date NOT NULL,
	"profile_picture_url" text,
	"agreed_to_terms" boolean NOT NULL,
	"wants_notifications" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_information_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
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
	"created_by" text NOT NULL,
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
CREATE TABLE "learning_resource_progress" (
	"id" uuid PRIMARY KEY NOT NULL,
	"learning_resource_module_id" uuid,
	"user_id" text NOT NULL,
	"progress" text NOT NULL,
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
	"is_public" boolean DEFAULT false,
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
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_information" ADD CONSTRAINT "user_information_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "file" ADD CONSTRAINT "file_uploaded_by_user_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "file" ADD CONSTRAINT "file_learning_resource_id_learning_resource_id_fk" FOREIGN KEY ("learning_resource_id") REFERENCES "public"."learning_resource"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_resource_module" ADD CONSTRAINT "learning_resource_module_learning_resource_id_learning_resource_id_fk" FOREIGN KEY ("learning_resource_id") REFERENCES "public"."learning_resource"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_resource_module" ADD CONSTRAINT "learning_resource_module_module_id_file_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."file"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_resource_progress" ADD CONSTRAINT "learning_resource_progress_learning_resource_module_id_learning_resource_module_id_fk" FOREIGN KEY ("learning_resource_module_id") REFERENCES "public"."learning_resource_module"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metadata" ADD CONSTRAINT "metadata_quiz_id_quiz_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quiz"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_answer_question" ADD CONSTRAINT "quiz_answer_question_quiz_question_id_quiz_question_id_fk" FOREIGN KEY ("quiz_question_id") REFERENCES "public"."quiz_question"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_answer_question" ADD CONSTRAINT "quiz_answer_question_quiz_id_quiz_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quiz"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_question" ADD CONSTRAINT "quiz_question_quiz_id_quiz_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quiz"("id") ON DELETE cascade ON UPDATE no action;