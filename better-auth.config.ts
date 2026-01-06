/**
 * Better Auth CLI configuration file
 *
 * Docs: https://www.better-auth.com/docs/concepts/cli
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";

const { DATABASE_URL, BETTER_AUTH_URL, BETTER_AUTH_SECRET } = process.env;

const sql = neon(DATABASE_URL!);
const db = drizzle(sql);

export const auth: ReturnType<typeof betterAuth> = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }), // schema is required in order for bettter-auth to recognize
  baseURL: BETTER_AUTH_URL,
  secret: BETTER_AUTH_SECRET,
  trustedOrigins:
    process.env.NODE_ENV === "production"
      ? ["https://lumino.kholishafid.com", "https://lumino.pages.dev"]
      : ["http://localhost:5000"],
});
