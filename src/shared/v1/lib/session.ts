import { EnvContext } from "../services";
import { auth } from "./better-auth";
import { config } from "../../../config/env";

export async function getSession(c: EnvContext) {
  return await auth(config).api.getSession({
    headers: c.req.raw.headers,
  });
}
