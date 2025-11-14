import { Context } from "hono";
import { Env } from "@/index";
import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { taskService } from "./task";

export type Database = NeonHttpDatabase<Record<string, never>> & {
  $client: NeonQueryFunction<false, false>;
};

export class Services {
  private context: Context<Env>;
  private db: Database;

  constructor(c: Context<Env>) {
    this.context = c;
    const sql = neon(c.env.DATABASE_URL);
    const db = drizzle(sql);
    this.db = db;
  }

  task() {
    return taskService(this.db);
  }
}
