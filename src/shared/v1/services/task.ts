import { Database } from "./";
import { task as taskSchema } from "../lib/db/schema/task";
import { eq } from "drizzle-orm";

export const taskService = (db: Database) => {
  return {
    getTask() {
      return db
        .select({
          id: taskSchema.id,
          title: taskSchema.title,
          description: taskSchema.description,
          dueDate: taskSchema.dueDate,
        })
        .from(taskSchema)
        .execute();
    },
    createTask(title: string, description: string, due_date?: Date) {
      return db
        .insert(taskSchema)
        .values({
          id: crypto.randomUUID(),
          title,
          description,
          dueDate: due_date,
        })
        .returning();
    },
    async updateTask(
      id: string,
      title?: string,
      description?: string,
      due_date?: Date
    ) {
      const target = await db
        .select()
        .from(taskSchema)
        .where(eq(taskSchema.id, id))
        .execute();

      if (target.length === 0) {
        return {
          success: false,
          message: `Task with id: ${id} not found`,
        };
      }

      const updated = await db
        .update(taskSchema)
        .set({
          title,
          description,
          dueDate: due_date,
        })
        .where(eq(taskSchema.id, id))
        .returning();

      return {
        message: `Task with id: ${id} updated successfully`,
        data: updated,
        success: true,
      };
    },
    async deleteTask(id: string) {
      const target = await db
        .select()
        .from(taskSchema)
        .where(eq(taskSchema.id, id))
        .execute();

      if (target.length === 0) {
        return {
          success: false,
          message: `Task with id: ${id} not found`,
        };
      }
      const deleted = await db
        .delete(taskSchema)
        .where(eq(taskSchema.id, id))
        .returning();

      return {
        message: `Task with id: ${id} deleted successfully`,
        data: deleted,
        success: true,
      };
    },
  };
};
