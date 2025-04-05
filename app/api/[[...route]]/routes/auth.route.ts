import {
  logInFormSchema,
  SignUpFormSchema,
} from "@/lib/validation-schema/auth-validation-schema";
import { createAdminClient } from "@/lib/server/appwrite";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID } from "node-appwrite";
import { setCookie, deleteCookie } from "hono/cookie";
import { AUTH_COOKIE } from "@/constants";
import { authMiddleware } from "@/lib/server/authMiddleware";

const app = new Hono()
  .get("/current", authMiddleware, (c) => {
    const user = c.get("user");
    return c.json({ data: user });
  })

  .post("/login", zValidator("json", logInFormSchema), async (c) => {
    const { email, password } = c.req.valid("json");

    const { account } = await createAdminClient();

    try {
      // Create a session for the existing user
      const session = await account.createEmailPasswordSession(email, password);

      // Set authentication cookie
      setCookie(c, AUTH_COOKIE, session.secret, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      });

      return c.json({ success: true });
    } catch (error: any) {
      return c.json({ error: error.message }, 401);
    }
  })

  .post("/register", zValidator("json", SignUpFormSchema), async (c) => {
    const { name, email, password } = c.req.valid("json");

    const { account } = await createAdminClient();

    const user = await account.create(ID.unique(), email, password, name);

    const session = await account.createEmailPasswordSession(email, password);

    setCookie(c, AUTH_COOKIE, session.secret, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return c.json({ data: user });
  })

  .post("/logout", authMiddleware, async (c) => {
    const account = c.get("account");

    deleteCookie(c, AUTH_COOKIE);
    await account.deleteSession("current");

    return c.json({ message: "Logged Out" });
  });

export default app;
