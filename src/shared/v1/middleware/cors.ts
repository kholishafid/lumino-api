import { cors } from "hono/cors";

export const corsMiddleware = (isProd: boolean) => {
  return cors({
    origin: isProd
      ? ["https://lumino.kholishafid.com", "https://lumino.pages.dev"]
      : ["http://localhost:5000"],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS", "DELETE", "PUT"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  });
};
