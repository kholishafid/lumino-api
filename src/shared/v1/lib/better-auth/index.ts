import { drizzle } from "drizzle-orm/node-postgres";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";

import * as accountSchema from "../../../../integrations/db/schema/account";
import * as taskSchema from "../../../../integrations/db/schema/task";
import { openAPI } from "better-auth/plugins";
import type { AppConfig } from "../../../../config/env";
import { pool } from "../../../../integrations/db/client";

export const auth = (
  env: AppConfig
): ReturnType<typeof betterAuth> => {
  const db = drizzle(pool, { schema: { ...accountSchema, ...taskSchema } });

  return betterAuth({
    appName: "Task Tracker",
    basePath: "/api/v1/auth/",
    trustedOrigins:
      env.ENVIRONMENT === "production"
        ? ["https://lumino.kholishafid.com", "https://lumino.pages.dev"]
        : ["http://localhost:5000"],
    emailAndPassword: {
      enabled: true,
    },
    advanced: {
      defaultCookieAttributes: {
        sameSite: "none",
        secure: true,
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
