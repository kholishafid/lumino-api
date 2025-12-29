import { relations } from "drizzle-orm";
import { boolean, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { subtask } from "./subtask";
import { user } from "./account";
// priority enum: low, medium, high

export const enumPriority = pgEnum("priority", ["low", "medium", "high"]);

export const task = pgTable("task", {
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

  createdBy: text("created_by").notNull(),
});

export const taskRelations = relations(task, ({ many, one }) => ({
  subtask: many(subtask),
  user: one(user, {
    fields: [task.createdBy],
    references: [user.id],
  }),
}));
