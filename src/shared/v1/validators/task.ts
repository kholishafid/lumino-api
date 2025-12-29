import { sValidator } from "@hono/standard-validator";
import z from "zod";

const getTaskQueryValidator = sValidator(
  "query",
  z.object({
    isFinished: z.string().optional(),
  }),
);

const createTaskValidator = sValidator(
  "json",
  z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string(),
    due_date: z.coerce.date().optional(),
    priority: z.enum(["low", "medium", "high"]).optional().default("medium"),
  }),
);

const updateTaskValidator = sValidator(
  "json",
  z.object({
    title: z.string().min(1, "Title is required").optional(),
    description: z.string().optional(),
    due_date: z.coerce.date().optional(),
  }),
);

const addSubtaskValidator = sValidator(
  "json",
  z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string(),
    due_date: z.coerce.date().optional(),
    priority: z.enum(["low", "medium", "high"]).optional().default("medium"),
  }),
);

const markAsFinishedValidator = sValidator(
  "json",
  z.object({
    ids: z.string().or(z.array(z.string())),
  }),
);

export {
  getTaskQueryValidator,
  createTaskValidator,
  updateTaskValidator,
  addSubtaskValidator,
  markAsFinishedValidator,
};
