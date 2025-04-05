import { DATABASE_ID, PROJECTS_ID } from "@/constants";
import { createSessionClient } from "../appwrite";
import { getMember } from "../member/queries";
import { Project } from "@/app/types";

export async function getProject(projectId: string) {
  const { databases, account } = await createSessionClient();
  const user = await account.get();

  const project = await databases.getDocument<Project>(
    DATABASE_ID,
    PROJECTS_ID,
    projectId
  );

  const member = getMember({
    databases,
    workspaceId: project.workspaceId,
    userId: user.$id,
  });

  return project;
}
