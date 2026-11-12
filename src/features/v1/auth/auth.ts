import { Hono } from "hono";
import { Env } from "../../..";
import { auth } from "../../../shared/v1/lib/better-auth";
import { config } from "../../../config/env";

const authRoute = new Hono<Env>();

authRoute.on(["GET", "POST"], "/auth/*", (c) => {
  return auth(config).handler(c.req.raw);
});

export default authRoute;
