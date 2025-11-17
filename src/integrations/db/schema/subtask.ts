import { relations } from "drizzle-orm";
import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { task } from "./task";

export const subtask = pgTable("subtask", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date"),
  isFinished: boolean("is_finished").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),

  taskId: text("task_id").notNull(),
});

export const subtaskRelations = relations(subtask, ({ one }) => ({
  taskParent: one(task, {
    fields: [subtask.taskId],
    references: [task.id],
  }),
}));
