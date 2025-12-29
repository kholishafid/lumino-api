import { EnvContext } from "../services";
import { auth } from "./better-auth";

export async function getSession(c: EnvContext) {
  return await auth(c.env).api.getSession({
    headers: c.req.raw.headers,
  });
}
