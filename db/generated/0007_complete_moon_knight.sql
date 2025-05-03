CREATE TABLE "learning_resource_module" (
	"id" uuid PRIMARY KEY NOT NULL,
	"learning_resource_id" uuid,
	"module_id" uuid,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "learning_resource" DROP CONSTRAINT "learning_resource_file_id_file_id_fk";
--> statement-breakpoint
ALTER TABLE "quiz_answer_question" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "learning_resource" ADD COLUMN "description" text NOT NULL;--> statement-breakpoint
ALTER TABLE "learning_resource" ADD COLUMN "is_visible" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "learning_resource_module" ADD CONSTRAINT "learning_resource_module_learning_resource_id_learning_resource_id_fk" FOREIGN KEY ("learning_resource_id") REFERENCES "public"."learning_resource"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_resource_module" ADD CONSTRAINT "learning_resource_module_module_id_file_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."file"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_resource" DROP COLUMN "file_id";