CREATE TYPE "public"."priority" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TABLE "subtask" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"due_date" timestamp,
	"priority" "priority" DEFAULT 'medium',
	"is_finished" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"task_id" text NOT NULL,
	"created_by" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "priority" "priority" DEFAULT 'medium';--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "created_by" text NOT NULL;