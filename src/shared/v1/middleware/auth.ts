import { createMiddleware } from "hono/factory";
import { auth } from "../lib/better-auth";
import { config } from "../../../config/env";

export const authMiddleware = createMiddleware(async (c, next) => {
  const session = await auth(config).api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    if (!c.req.path.startsWith("/api/v1/auth")) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  await next();
});
