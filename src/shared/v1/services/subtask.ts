import { Database, EnvContext } from "./";
import { subtask as subtaskSchema } from "@/integrations/db/schema/subtask";
import { task as taskSchema } from "@/integrations/db/schema/task";
import { and, desc, eq } from "drizzle-orm";
import { getSession } from "../lib/session";

export const subTaskService = ({ db, c }: { db: Database; c: EnvContext }) => {
  return {
    async getSubtaskById(id: string) {
      const session = await getSession(c);

      if (!session || !session.user) {
        return {
          success: false,
          message: "Unauthorized",
        };
      }

      const subtask = await db
        .select()
        .from(subtaskSchema)
        .where(
          and(
            eq(subtaskSchema.id, id),
            eq(subtaskSchema.createdBy, session.user.id)
          )
        )
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
    async getSubtasks(taskId?: string) {
      const session = await getSession(c);

      if (!session || !session.user) {
        return {
          success: false,
          message: "Unauthorized",
        };
      }

      const data = await db
        .select()
        .from(subtaskSchema)
        .orderBy(desc(subtaskSchema.createdAt))
        .where(
          and(
            eq(subtaskSchema.createdBy, session.user.id),
            taskId ? eq(subtaskSchema.taskId, taskId) : undefined
          )
        );

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
      const session = await getSession(c);

      if (!session || !session.user) {
        return {
          success: false,
          message: "Unauthorized",
        };
      }

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
          createdBy: session.user.id,
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
      const session = await getSession(c);

      if (!session || !session.user) {
        return {
          success: false,
          message: "Unauthorized",
        };
      }

      const target = await db
        .select()
        .from(subtaskSchema)
        .where(
          and(
            eq(subtaskSchema.id, id),
            eq(subtaskSchema.createdBy, session.user.id)
          )
        )
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
      const session = await getSession(c);

      if (!session || !session.user) {
        return {
          success: false,
          message: "Unauthorized",
        };
      }

      const target = await db
        .select()
        .from(subtaskSchema)
        .where(
          and(
            eq(subtaskSchema.id, id),
            eq(subtaskSchema.createdBy, session.user.id)
          )
        )
        .execute();

      if (target.length === 0) {
        return {
          success: false,
          message: `Subtask with id: ${id} not found`,
        };
      }

      await db
        .delete(subtaskSchema)
        .where(
          and(
            eq(subtaskSchema.id, id),
            eq(subtaskSchema.createdBy, session.user.id)
          )
        )
        .returning();

      return {
        message: `Subtask with id: ${id} deleted successfully`,
        success: true,
      };
    },
  };
};
