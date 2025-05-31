ALTER TABLE "metadata" ADD COLUMN "is_public" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "quiz" DROP COLUMN "is_public";