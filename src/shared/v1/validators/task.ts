import { sValidator } from "@hono/standard-validator";
import z from "zod";

const createTaskValidator = sValidator(
  "json",
  z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    due_date: z.coerce.date().optional(),
  })
);

const updateTaskValidator = sValidator(
  "json",
  z.object({
    title: z.string().min(1, "Title is required").optional(),
    description: z.string().min(1, "Description is required").optional(),
    due_date: z.coerce.date().optional(),
  })
);

const addSubtaskValidator = sValidator(
  "json",
  z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    due_date: z.coerce.date().optional(),
  })
);

export { createTaskValidator, updateTaskValidator, addSubtaskValidator };
