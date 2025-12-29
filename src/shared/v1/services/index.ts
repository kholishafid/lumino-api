import { Context } from "hono";
import { Env } from "@/index";
import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
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

export type EnvContext = Context<Env>;

export class Services {
  private context: EnvContext;
  private db: Database;

  constructor(c: EnvContext) {
    this.context = c;
    const sql = neon(c.env.DATABASE_URL);
    const db = drizzle(sql, {
      schema,
    });

    this.db = db as unknown as Database;
  }

  task() {
    return taskService({ db: this.db, c: this.context });
  }

  subtask() {
    return subTaskService({ db: this.db, c: this.context });
  }
}
