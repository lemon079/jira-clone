"use server";

import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/constants";
import { Query } from "node-appwrite";
import { createSessionClient } from "../appwrite";

export async function getWorkSpaces() {
  const { databases, account } = await createSessionClient();

  const user = await account.get();

  const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
    Query.equal("userId", user.$id),
  ]);

  if (members.total === 0) {
    return { documents: [], total: 0 };
  }

  const workspaceIds = members.documents.map((member) => member.workspaceId);

  const workspaces = await databases.listDocuments(DATABASE_ID, WORKSPACES_ID, [
    Query.equal("userId", user.$id),
    Query.contains("$id", workspaceIds),
    Query.orderDesc("$createdAt"),
  ]);

  return workspaces;
}
