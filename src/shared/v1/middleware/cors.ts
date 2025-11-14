import { cors } from "hono/cors";

export const corsMiddleware = cors({
  origin: "http://localhost:5000",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["POST", "GET", "OPTIONS", "DELETE"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
  credentials: true,
});
