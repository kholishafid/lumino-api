import { sValidator } from "@hono/standard-validator";
import z from "zod";
import { is } from "zod/locales";

const getSubtaskQueryValidator = sValidator(
  "query",
  z.object({
    taskId: z.string().optional(),
    isFinished: z
      .string()
      .refine((val) => val === "true" || val === "false" || val === undefined, {
        message: "isFinished must be 'true' or 'false'",
      })
      .optional(),
  }),
);

const createSubtaskValidator = sValidator(
  "json",
  z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string("Description is required"),
    dueDate: z.coerce.date().optional(),
    task_id: z.string().min(1, "Task ID is required"),
  }),
);

const updateSubtaskValidator = sValidator(
  "json",
  z.object({
    title: z.string().min(1, "Title is required").optional(),
    description: z.string().min(1, "Description is required").optional(),
    dueDate: z.coerce.date().optional(),
  }),
);

export {
  getSubtaskQueryValidator,
  createSubtaskValidator,
  updateSubtaskValidator,
};
