"use server";

import { createSessionClient } from "../appwrite";

export async function getCurrentUser() {
  try {
    const { account } = await createSessionClient();
    const user = await account.get();

    return user;
  } catch {
    return null;
  }
}
