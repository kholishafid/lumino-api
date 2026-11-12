import { Context } from "hono";
import { Env } from "@/index";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { drizzle } from "drizzle-orm/node-postgres";
import { taskService } from "./task";
import { subTaskService } from "./subtask";
import { task } from "@/integrations/db/schema/task";
import { subtask } from "@/integrations/db/schema/subtask";
import { pool } from "@/integrations/db/client";

const schema = {
  task,
  subtask,
};

export type Database = NodePgDatabase<typeof schema>;

export type EnvContext = Context<Env>;

export class Services {
  private context: EnvContext;
  private db: Database;

  constructor(c: EnvContext) {
    this.context = c;
    const db = drizzle(pool, {
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
