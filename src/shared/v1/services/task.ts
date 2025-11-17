import { Database } from "./";
import { task as taskSchema } from "@/integrations/db/schema/task";
import { subtask as subtaskSchema } from "@/integrations/db/schema/subtask";
import { desc, eq, InferSelectModel } from "drizzle-orm";

export const taskService = (db: Database) => {
  return {
    async getTaskById(id: string) {
      const task = await db
        .select({
          task: taskSchema,
          subtask: subtaskSchema,
        })
        .from(taskSchema)
        .leftJoin(subtaskSchema, eq(taskSchema.id, subtaskSchema.taskId))
        .where(eq(taskSchema.id, id))
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
    async getTasks() {
      const data = await db
        .select({
          task: taskSchema,
          subtask: subtaskSchema,
        })
        .from(taskSchema)
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

      return Object.values(mappedData).map(({ task, subtasks }) => ({
        ...task,
        subtasks,
      }));
    },
    async createTask(title: string, description: string, due_date?: Date) {
      return await db
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
        data: updated[0],
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
    async addSubtask(
      id: string,
      subtask: {
        title: string;
        description: string;
        due_date?: Date;
      }
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

      const inserted = await db
        .insert(subtaskSchema)
        .values({
          id: crypto.randomUUID(),
          title: subtask.title,
          description: subtask.description,
          dueDate: subtask.due_date,
          taskId: id,
        })
        .returning();

      return {
        message: `Subtask added to task with id: ${id} successfully`,
        success: true,
        data: inserted,
      };
    },
  };
};
