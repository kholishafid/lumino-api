import { Env } from "@/index";
import { res } from "@/shared/v1/lib/response";
import { Services } from "@/shared/v1/services";
import {
  createSubtaskValidator,
  getSubtaskQueryValidator,
  updateSubtaskValidator,
} from "@/shared/v1/validators/subtask";
import { markAsFinishedValidator } from "@/shared/v1/validators/task";
import { OpenAPIHono } from "@hono/zod-openapi";

const subtaskRoute = new OpenAPIHono<Env>();

subtaskRoute.get("/subtasks", getSubtaskQueryValidator, async (c) => {
  const { taskId, isFinished } = c.req.valid("query");
  const service = new Services(c);

  const { message, success, data } = await service.subtask().getSubtasks({
    taskId,
    isFinished:
      isFinished === "true" ? true : isFinished === "false" ? false : undefined,
  });

  return c.json(
    res({
      status: success ? "success" : "fail",
      message: message,
      data: data,
    }),
    success ? 200 : 404,
  );
});

subtaskRoute.post("/subtasks", createSubtaskValidator, async (c) => {
  const { title, description, dueDate, task_id } = c.req.valid("json");
  const service = new Services(c);

  const { data, message, success } = await service.subtask().createSubtask({
    subtask: { title, description, dueDate },
    taskId: task_id,
  });
  return c.json(
    res({
      status: success ? "success" : "fail",
      message: message,
      data,
    }),
    success ? 201 : 400,
  );
});

subtaskRoute.post(
  "/subtasks/mark-finished",
  markAsFinishedValidator,
  async (c) => {
    const { ids } = c.req.valid("json");
    const service = new Services(c);

    const { success, message, data } = await service
      .subtask()
      .markTasksAsFinished(ids);

    return c.json(
      res({
        status: success ? "success" : "fail",
        message: message,
        data: data,
      }),
      200,
    );
  },
);

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
    success ? 200 : 404,
  );
});

subtaskRoute.post("/subtasks", createSubtaskValidator, async (c) => {
  const { title, description, dueDate, task_id } = c.req.valid("json");
  const service = new Services(c);

  const { message, success, data } = await service
    .task()
    .addSubtask(task_id, { title, description, dueDate });

  return c.json(
    res({
      status: success ? "success" : "fail",
      message: message,
      data: data,
    }),
    success ? 201 : 400,
  );
});

subtaskRoute.put("/subtasks/:id", updateSubtaskValidator, async (c) => {
  const { id } = c.req.param();
  const { title, description, dueDate } = c.req.valid("json");

  if (!title && !description && !dueDate && !id) {
    return c.json(
      res({
        status: "fail",
        message: "Nothing to update",
      }),
      200,
    );
  }

  const service = new Services(c);

  const { success, message, data } = await service
    .subtask()
    .updateSubtask(id, title, description, dueDate);

  return c.json(
    res({
      status: success ? "success" : "fail",
      message: message,
      data: data,
    }),
    200,
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
    200,
  );
});

export default subtaskRoute;
