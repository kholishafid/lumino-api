import { Database } from "./";
import { subtask as subtaskSchema } from "@/integrations/db/schema/subtask";
import { task as taskSchema } from "@/integrations/db/schema/task";
import { desc, eq } from "drizzle-orm";

export const subTaskService = (db: Database) => {
  return {
    async getSubtaskById(id: string) {
      const subtask = await db
        .select()
        .from(subtaskSchema)
        .where(eq(subtaskSchema.id, id))
        .limit(1)
        .execute();

      if (subtask.length === 0) {
        return {
          success: false,
          message: `Subtask with id: ${id} not found`,
        };
      }

      return {
        message: `Subtask with id: ${id} retrieved successfully`,
        success: true,
        data: subtask[0],
      };
    },
    async getSubtasks() {
      const data = await db
        .select()
        .from(subtaskSchema)
        .orderBy(desc(subtaskSchema.createdAt))
        .execute();

      return {
        message: `Subtasks retrieved successfully`,
        success: true,
        data: data,
      };
    },
    async createSubtask({
      subtask: { title, description, due_date },
      taskId,
    }: {
      subtask: {
        title: string;
        description: string;
        due_date: Date | undefined;
      };
      taskId: string;
    }) {
      const task = await db
        .select()
        .from(taskSchema)
        .where(eq(taskSchema.id, taskId))
        .execute();

      if (task.length === 0) {
        return {
          success: false,
          message: `Task with id: ${taskId} not found`,
        };
      }

      const subtask = await db
        .insert(subtaskSchema)
        .values({
          id: crypto.randomUUID(),
          title,
          description,
          dueDate: due_date,
          taskId: taskId,
        })
        .returning();

      return {
        message: `Subtask created successfully`,
        success: true,
        data: subtask[0],
      };
    },
    async updateSubtask(
      id: string,
      title?: string,
      description?: string,
      due_date?: Date
    ) {
      const target = await db
        .select()
        .from(subtaskSchema)
        .where(eq(subtaskSchema.id, id))
        .execute();

      if (target.length === 0) {
        return {
          success: false,
          message: `Task with id: ${id} not found`,
        };
      }

      const updated = await db
        .update(subtaskSchema)
        .set({
          title,
          description,
          dueDate: due_date,
        })
        .where(eq(subtaskSchema.id, id))
        .returning();

      return {
        message: `Subtask with id: ${id} updated successfully`,
        data: updated,
        success: true,
      };
    },
    async deleteSubtask(id: string) {
      const target = await db
        .select()
        .from(subtaskSchema)
        .where(eq(subtaskSchema.id, id))
        .execute();

      if (target.length === 0) {
        return {
          success: false,
          message: `Subtask with id: ${id} not found`,
        };
      }
      const deleted = await db
        .delete(subtaskSchema)
        .where(eq(subtaskSchema.id, id))
        .returning();

      return {
        message: `Subtask with id: ${id} deleted successfully`,
        data: deleted,
        success: true,
      };
    },
  };
};
