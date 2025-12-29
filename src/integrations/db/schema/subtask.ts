import { relations } from "drizzle-orm";
import { boolean, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { task } from "./task";
import { user } from "./account";

export const enumPriority = pgEnum("priority", ["low", "medium", "high"]);

export const subtask = pgTable("subtask", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date"),
  priority: enumPriority().default("medium"),
  isFinished: boolean("is_finished").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),

  taskId: text("task_id").notNull(),
  createdBy: text("created_by").notNull(),
});

export const subtaskRelations = relations(subtask, ({ one }) => ({
  taskParent: one(task, {
    fields: [subtask.taskId],
    references: [task.id],
  }),
  user: one(user, {
    fields: [subtask.createdBy],
    references: [user.id],
  }),
}));
