import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";

import * as accountSchema from "../../../../integrations/db/schema/account";
import * as taskSchema from "../../../../integrations/db/schema/task";
import { openAPI } from "better-auth/plugins";

export const auth = (
  env: CloudflareBindings
): ReturnType<typeof betterAuth> => {
  const sql = neon(env.DATABASE_URL);
  const db = drizzle(sql, { schema: { ...accountSchema, ...taskSchema } });

  return betterAuth({
    appName: "Task Tracker",
    basePath: "/api/v1/auth/",
    trustedOrigins:
      env.ENVIRONMENT === "production"
        ? ["https://lumino.kholishafid.com", "https://lumino.pages.dev", "https://lumino-api.itsmaehere.workers.dev"]
        : ["http://localhost:5000"],
    emailAndPassword: {
      enabled: true,
    },
    advanced: {
      defaultCookieAttributes: {
        sameSite: "none",
        secure: true,
        partitioned: true,
      },
    },
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: {
        ...accountSchema,
        ...taskSchema,
      },
    }),
    baseURL: env.APP_URL,
    secret: env.BETTER_AUTH_SECRET,
    plugins: [openAPI({ path: "/reference" })],
  });
};
