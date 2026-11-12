import "dotenv/config";

export type AppConfig = {
  DATABASE_URL: string;
  ENVIRONMENT: "production" | "development";
  APP_URL: string;
  BETTER_AUTH_SECRET: string;
};

function required(name: keyof AppConfig): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const config: AppConfig = {
  DATABASE_URL: required("DATABASE_URL"),
  ENVIRONMENT: process.env.ENVIRONMENT === "production" ? "production" : "development",
  APP_URL: required("APP_URL"),
  BETTER_AUTH_SECRET: required("BETTER_AUTH_SECRET"),
};
