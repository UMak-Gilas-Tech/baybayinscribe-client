ALTER TABLE "learning_resource_progress" RENAME COLUMN "learning_resource_id" TO "learning_resource_module_id";--> statement-breakpoint
ALTER TABLE "learning_resource_progress" DROP CONSTRAINT "learning_resource_progress_learning_resource_id_learning_resource_id_fk";
--> statement-breakpoint
ALTER TABLE "learning_resource_progress" ADD CONSTRAINT "learning_resource_progress_learning_resource_module_id_learning_resource_module_id_fk" FOREIGN KEY ("learning_resource_module_id") REFERENCES "public"."learning_resource_module"("id") ON DELETE no action ON UPDATE no action;