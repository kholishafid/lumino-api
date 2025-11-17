import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/integrations/db/migrations",
  schema: "./src/integrations/db/schema",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
