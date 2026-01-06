import { cors } from "hono/cors";

export const corsMiddleware = cors({
  origin: (origin, c) => {
    const allowed =
      c.env.ENVIRONMENT === "production"
        ? ["https://lumino.kholishafid.com", "https://lumino.pages.dev"]
        : ["http://localhost:5000"];

    return allowed.includes(origin) ? origin : null;
  },
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["POST", "GET", "OPTIONS", "DELETE", "PUT"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
  credentials: true,
});
