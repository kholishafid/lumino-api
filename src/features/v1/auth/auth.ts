import { Hono } from "hono";
import { Env } from "../../..";
import { auth } from "../../../shared/v1/lib/better-auth";

const authRoute = new Hono<Env>();

authRoute.on(["GET", "POST"], "/auth/*", (c) => {
  return auth(c.env).handler(c.req.raw);
});

export default authRoute;
