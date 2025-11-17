import { Context } from "hono";
import { Env } from "@/index";
import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { taskService } from "./task";
import { subTaskService } from "./subtask";
import { task } from "@/integrations/db/schema/task";
import { subtask } from "@/integrations/db/schema/subtask";

const schema = {
  task,
  subtask,
};

export type Database = NeonHttpDatabase<typeof schema> & {
  $client: ReturnType<typeof neon>;
};

export class Services {
  private context: Context<Env>;
  private db: Database;

  constructor(c: Context<Env>) {
    this.context = c;
    const sql = neon(c.env.DATABASE_URL);
    const db = drizzle(sql, {
      schema,
    });

    this.db = db as unknown as Database;
  }

  task() {
    return taskService(this.db);
  }

  subtask() {
    return subTaskService(this.db);
  }
}
