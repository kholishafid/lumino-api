import { Env } from "../../..";
import { OpenAPIHono } from "@hono/zod-openapi";
import { Services } from "../../../shared/v1/services";
import {
  createTaskValidator,
  updateTaskValidator,
} from "../../../shared/v1/validators/task";
import { getTaskDoc } from "../../../docs/open-api/v1/task";
import { res } from "../../../shared/v1/lib/response";

const taskRoute = new OpenAPIHono<Env>();

taskRoute.openapi(getTaskDoc, async (c) => {
  const service = new Services(c);

  const tasks = await service.task().getTask();

  return c.json(
    res({
      status: "success",
      message: "Tasks retrieved successfully",
      data: tasks,
    }),
    200
  );
});

taskRoute.post("/tasks", createTaskValidator, async (c) => {
  const { title, description, due_date } = c.req.valid("json");
  const service = new Services(c);

  await service.task().createTask(title, description, due_date);

  return c.json(
    res({
      status: "success",
      message: "Task created successfully",
      data: { title, description },
    }),
    201
  );
});

taskRoute.put("/tasks/:id", updateTaskValidator, async (c) => {
  const { id } = c.req.param();
  const { title, description, due_date } = c.req.valid("json");

  if (!title && !description && !due_date) {
    return c.json(
      res({
        status: "fail",
        message: "Nothing to update",
      }),
      200
    );
  }

  const service = new Services(c);

  const { success, message, data } = await service
    .task()
    .updateTask(id, title, description, due_date);

  return c.json(
    res({
      status: success ? "success" : "fail",
      message: message,
      data: data,
    }),
    200
  );
});

taskRoute.delete("/tasks/:id", async (c) => {
  const { id } = c.req.param();
  const service = new Services(c);

  const { success, message, data } = await service.task().deleteTask(id);

  return c.json(
    res({
      status: success ? "success" : "fail",
      message: message,
      data: data,
    }),
    200
  );
});

export default taskRoute;
