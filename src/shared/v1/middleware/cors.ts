import { cors } from "hono/cors";
import { config } from "../../../config/env";

export const corsMiddleware = cors({
  origin: (origin, c) => {
    const allowed =
      config.ENVIRONMENT === "production"
        ? ["https://lumino.kholishafid.com", "https://lumino.pages.dev"]
        : ["http://localhost:5000"];

    if (!origin) return allowed[0];

    return allowed.includes(origin) ? origin : null;
  },
  allowHeaders: ["Content-Type", "Authorization","Origin"],
  allowMethods: ["POST", "GET", "OPTIONS", "DELETE", "PUT"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
  credentials: true,
});
