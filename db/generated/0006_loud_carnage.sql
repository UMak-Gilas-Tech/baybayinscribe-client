CREATE TABLE "learning_resource_progress" (
	"id" uuid PRIMARY KEY NOT NULL,
	"learning_resource_id" uuid,
	"user_id" text NOT NULL,
	"progress" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "learning_resource_progress" ADD CONSTRAINT "learning_resource_progress_learning_resource_id_learning_resource_id_fk" FOREIGN KEY ("learning_resource_id") REFERENCES "public"."learning_resource"("id") ON DELETE no action ON UPDATE no action;