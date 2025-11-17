import { Env } from "@/index";
import { res } from "@/shared/v1/lib/response";
import { Services } from "@/shared/v1/services";
import {
  createSubtaskValidator,
  updateSubtaskValidator,
} from "@/shared/v1/validators/subtask";
import { OpenAPIHono } from "@hono/zod-openapi";

const subtaskRoute = new OpenAPIHono<Env>();

subtaskRoute.get("/subtasks", async (c) => {
  const service = new Services(c);

  const subtasks = await service.subtask().getSubtasks();

  return c.json(
    res({
      status: "success",
      message: "Subtasks retrieved successfully",
      data: subtasks,
    }),
    200
  );
});

subtaskRoute.post("/subtasks", createSubtaskValidator, async (c) => {
  const { title, description, due_date, task_id } = c.req.valid("json");
  const service = new Services(c);

  const { data, message, success } = await service.subtask().createSubtask({
    subtask: { title, description, due_date },
    taskId: task_id,
  });
  return c.json(
    res({
      status: success ? "success" : "fail",
      message: message,
      data,
    }),
    success ? 201 : 400
  );
});

subtaskRoute.get("/subtasks/:id", async (c) => {
  const { id } = c.req.param();
  const service = new Services(c);

  const { message, success, data } = await service.subtask().getSubtaskById(id);

  return c.json(
    res({
      status: success ? "success" : "fail",
      message: message,
      data: data,
    }),
    success ? 200 : 404
  );
});

subtaskRoute.post("/subtasks", createSubtaskValidator, async (c) => {
  const { title, description, due_date, task_id } = c.req.valid("json");
  const service = new Services(c);

  const { message, success, data } = await service
    .task()
    .addSubtask(task_id, { title, description, due_date });

  return c.json(
    res({
      status: success ? "success" : "fail",
      message: message,
      data: data,
    }),
    success ? 201 : 400
  );
});

subtaskRoute.put("/subtasks/:id", updateSubtaskValidator, async (c) => {
  const { id } = c.req.param();
  const { title, description, due_date } = c.req.valid("json");

  if (!title && !description && !due_date && !id) {
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
    .subtask()
    .updateSubtask(id, title, description, due_date);

  return c.json(
    res({
      status: success ? "success" : "fail",
      message: message,
      data: data,
    }),
    200
  );
});

subtaskRoute.delete("/subtasks/:id", async (c) => {
  const { id } = c.req.param();
  const service = new Services(c);

  const { success, message } = await service.subtask().deleteSubtask(id);

  return c.json(
    res({
      status: success ? "success" : "fail",
      message: message,
    }),
    200
  );
});

export default subtaskRoute;
