import { showRoutes } from "hono/dev";
import { routesV1 } from "./routes";
import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { logger } from "hono/logger";
import { authMiddleware } from "./shared/v1/middleware/auth";
import { corsMiddleware } from "./shared/v1/middleware/cors";

export type Env = {
  Bindings: CloudflareBindings;
  Variables: {
    user: any;
    session: any;
  };
};

const app = new OpenAPIHono<Env>();

// middleware
app.use(logger());
app.use("/api/v1/*", (c, next) => {
  const isProd = c.env.ENVIRONTMENT === "production";
  return corsMiddleware(isProd)(c, next);
});
app.use("/api/*", authMiddleware);

// routes
app.route("/", routesV1);
app.get("/", (c) => {
  return c.text("🐇 Running...");
});

// OpenAPI Documentation
app.doc("/api/v1/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Task Tracker API",
    description: "API Documentation for Task Tracker Application",
  },
});

// Scalar API Reference
app.get(
  "/api/v1/scalar",
  Scalar({
    pageTitle: "Task Tracker API Reference",
    sources: [
      { url: "/api/v1/doc", title: "Task Tracker API Documentation" },
      { url: "/api/v1/auth/open-api/generate-schema", title: "Auth" },
    ],
  })
);

showRoutes(app);

export default app;
