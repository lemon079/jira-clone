import { AUTH_COOKIE } from "@/constants";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";

// since hono dont have built-in appwrite middleware as a third party, therefore we create a custom one
import {
    Client,
    Account,
    Models,
    Storage,
    Account as AccountType,
    Databases as DatabasesType,
    Users as UsersType,
    Storage as StorageType,
    Databases,
} from "node-appwrite";

interface AdditionalContext {
    Variables: {
        account: AccountType;
        databases: DatabasesType;
        users: UsersType;
        storage: StorageType;
        user: Models.User<Models.Preferences>;
    };
}

export const authMiddleware = createMiddleware<AdditionalContext>(
    async (c, next) => {
        const session = getCookie(c, AUTH_COOKIE);

        if (!session) {
            return c.json({ message: "Unauthorized" }, 401);
        }

        const client = new Client()
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

        client.setSession(session);
        const account = new Account(client);
        const user = await account.get();
        const databases = new Databases(client);
        const storage = new Storage(client);

        c.set("account", account);
        c.set("databases", databases);
        c.set("user", user);
        c.set("storage", storage)

        await next();
    }
);
