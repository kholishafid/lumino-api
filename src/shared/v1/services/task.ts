import { Database, EnvContext } from "./";
import { task as taskSchema } from "@/integrations/db/schema/task";
import { subtask as subtaskSchema } from "@/integrations/db/schema/subtask";
import { and, desc, eq, inArray, InferSelectModel } from "drizzle-orm";
import { getSession } from "../lib/session";

export const taskService = ({ db, c }: { db: Database; c: EnvContext }) => {
  return {
    async getTaskById(id: string) {
      const session = await getSession(c);

      if (!session || !session.user) {
        return {
          success: false,
          message: "Unauthorized",
        };
      }

      const task = await db
        .select({
          task: taskSchema,
          subtask: subtaskSchema,
        })
        .from(taskSchema)
        .leftJoin(subtaskSchema, eq(taskSchema.id, subtaskSchema.taskId))
        .where(
          and(eq(taskSchema.id, id), eq(taskSchema.createdBy, session.user.id))
        )
        .limit(1)
        .execute();

      if (task.length === 0) {
        return {
          success: false,
          message: `Task with id: ${id} not found`,
        };
      }

      return {
        message: `Task with id: ${id} retrieved successfully`,
        success: true,
        data: {
          id: task[0].task.id,
          title: task[0].task.title,
          description: task[0].task.description,
          dueDate: task[0].task.dueDate,
          subtask: task.map((row) => row.subtask).filter((st) => st !== null),
        },
      };
    },

    async getTasks({ isFinished }: { isFinished?: boolean }) {
      const session = await getSession(c);
      if (!session || !session.user) {
        return {
          success: false,
          message: "Unauthorized",
        };
      }

      const data = await db
        .select({
          task: taskSchema,
          subtask: subtaskSchema,
        })
        .from(taskSchema)
        .where(
          and(
            eq(taskSchema.createdBy, session.user.id),
            isFinished !== undefined
              ? eq(taskSchema.isFinished, isFinished)
              : undefined
          )
        )
        .orderBy(desc(taskSchema.createdAt))
        .leftJoin(subtaskSchema, eq(taskSchema.id, subtaskSchema.taskId));

      const mappedData: {
        [key: string]: {
          task: InferSelectModel<typeof taskSchema>;
          subtasks: Array<InferSelectModel<typeof subtaskSchema> | null>;
        };
      } = {};

      for (const row of data) {
        const taskId = row.task.id;

        if (!mappedData[taskId]) {
          mappedData[taskId] = {
            task: row.task,
            subtasks: [],
          };
        }

        if (row.subtask !== null) {
          mappedData[taskId].subtasks.push(row.subtask);
        }
      }

      return {
        message: "Tasks retrieved successfully",
        success: true,
        data: Object.values(mappedData).map((item) => ({
          ...item.task,
          subtasks: item.subtasks,
        })),
      };
    },

    async createTask(
      title: string,
      description: string,
      dueDate?: Date,
      priority?: "low" | "medium" | "high"
    ) {
      const session = await getSession(c);

      if (!session || !session.user) {
        return {
          success: false,
          message: "Unauthorized",
        };
      }

      const inserted = await db
        .insert(taskSchema)
        .values({
          id: crypto.randomUUID(),
          title,
          description,
          dueDate: dueDate,
          createdBy: session.user.id,
          priority: priority || "medium",
        })
        .returning();

      return {
        message: "Task created successfully",
        success: true,
        data: inserted[0],
      };
    },

    async updateTask(
      id: string,
      title?: string,
      description?: string,
      dueDate?: Date,
      priority?: "low" | "medium" | "high"
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
        .from(taskSchema)
        .where(
          and(eq(taskSchema.id, id), eq(taskSchema.createdBy, session.user.id))
        )
        .execute();

      if (target.length === 0) {
        return {
          success: false,
          message: `Task with id: ${id} not found`,
        };
      }

      console.log("Updating", {
        title,
        description,
        dueDate,
      })
      const updated = await db
        .update(taskSchema)
        .set({
          title,
          description,
          dueDate: dueDate,
          priority,
        })
        .where(eq(taskSchema.id, id))
        .returning();

      return {
        message: `Task with id: ${id} updated successfully`,
        data: updated[0],
        success: true,
      };
    },

    async deleteTask(id: string | string[]) {
      const session = await getSession(c);

      if (!session || !session.user) {
        return {
          success: false,
          message: "Unauthorized",
        };
      }

      const target = await db
        .select()
        .from(taskSchema)
        .where(
          and(
            inArray(taskSchema.id, Array.isArray(id) ? id : [id]),
            eq(taskSchema.createdBy, session.user.id)
          )
        )
        .execute();

      if (target.length === 0) {
        return {
          success: false,
          message: `Task with id: ${id} not found`,
        };
      }
      const deleted = await db
        .delete(taskSchema)
        .where(
          and(
            inArray(taskSchema.id, Array.isArray(id) ? id : [id]),
            eq(taskSchema.createdBy, session.user.id)
          )
        )
        .returning();

      return {
        message: `Task with id: ${id} deleted successfully`,
        data: deleted[0],
        success: true,
      };
    },

    async addSubtask(
      id: string,
      subtask: {
        title: string;
        description: string;
        dueDate?: Date;
        priority?: "low" | "medium" | "high";
      }
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
        .from(taskSchema)
        .where(
          and(eq(taskSchema.id, id), eq(taskSchema.createdBy, session.user.id))
        )
        .execute();

      if (target.length === 0) {
        return {
          success: false,
          message: `Task with id: ${id} not found`,
        };
      }

      const inserted = await db
        .insert(subtaskSchema)
        .values({
          id: crypto.randomUUID(),
          title: subtask.title,
          description: subtask.description,
          dueDate: subtask.dueDate,
          taskId: id,
          createdBy: session.user.id,
          priority: subtask.priority || "medium",
        })
        .returning();

      return {
        message: `Subtask added to task with id: ${id} successfully`,
        success: true,
        data: inserted[0],
      };
    },

    async markTasksAsFinished(ids: string | string[]) {
      const session = await getSession(c);

      if (!session || !session.user) {
        return {
          success: false,
          message: "Unauthorized",
        };
      }

      const idsArray = Array.isArray(ids) ? ids : [ids];

      try {
        const updated = await db
          .update(taskSchema)
          .set({ isFinished: true })
          .where(
            and(
              eq(taskSchema.createdBy, session.user.id),
              inArray(taskSchema.id, idsArray)
            )
          )
          .returning();
        return {
          message: `Task ${idsArray.join(
            ", "
          )} marked as finished successfully`,
          success: true,
          data: updated.map((item) => item.id),
        };
      } catch (error) {
        return {
          message: `Failed to mark tasks as finished`,
          success: false,
          data: error,
        };
      }
    },
  };
};
