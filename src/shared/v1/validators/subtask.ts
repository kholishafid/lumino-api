import { sValidator } from "@hono/standard-validator";
import z from "zod";

const createSubtaskValidator = sValidator(
  "json",
  z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string("Description is required"),
    due_date: z.coerce.date().optional(),
    task_id: z.string().min(1, "Task ID is required"),
  })
);

const updateSubtaskValidator = sValidator(
  "json",
  z.object({
    title: z.string().min(1, "Title is required").optional(),
    description: z.string().min(1, "Description is required").optional(),
    due_date: z.coerce.date().optional(),
  })
);

export { createSubtaskValidator, updateSubtaskValidator };
