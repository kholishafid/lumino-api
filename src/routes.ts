import authRoute from "./features/v1/auth/auth";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import taskRoute from "./features/v1/tasks/tasks";
import subtaskRoute from "./features/v1/subtask/subtask";
import { Env } from ".";

const routesV1 = new OpenAPIHono<Env>().basePath("/api/v1");

routesV1.route("/", authRoute);
routesV1.route("/", taskRoute);
routesV1.route("/", subtaskRoute);

const healthOpRoute = createRoute({
  method: "get",
  path: "/health",
  description: "Endpoint to check if the API is running",
  responses: {
    200: {
      content: {
        "text/plain": {
          schema: z.string().openapi({ example: "OK" }),
        },
      },
      description: "Health check endpoint",
    },
  },
});
routesV1.openapi(healthOpRoute, (c) => {
  return c.text("OK");
});

export { routesV1 };
