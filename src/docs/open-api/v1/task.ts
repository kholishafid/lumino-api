import { createRoute, z } from "@hono/zod-openapi";

export const getTaskDoc = createRoute({
  method: "get",
  path: "/tasks",
  tags: ["Tasks"],
  description: "Endpoint to get all tasks",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z
            .object({
              status: z.enum(["success", "error", "fail"]),
              message: z.string(),
              data: z
                .array(
                  z.object({
                    id: z.string(),
                    title: z.string(),
                    description: z.string().nullable(),
                    dueDate: z.string().nullable(),
                  })
                )
                .optional(),
            })
            .openapi({
              example: [
                {
                  status: "success",
                  message: "Tasks retrieved successfully",
                  data: {
                    id: "1",
                    title: "Finish project report",
                    description: "Complete the final report for the project",
                    dueDate: "2023-10-15",
                  },
                },
              ],
            }),
        },
      },
      description: "List of all tasks",
    },
  },
});
