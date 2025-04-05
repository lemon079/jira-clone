import { Models } from "node-appwrite";

export type Workspace = Models.Document & {
  name: string;
  email: string;
  imageUrl: string;
  inviteCode: string;
  userId: string;
};

export type Project = Models.Document & {
  name: string;
  imageUrl: string;
  workspaceId: string;
};

export enum TaskStatus {
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

export type Task = Models.Document & {
  name: string;
  status: TaskStatus;
  workspaceId: string;
  assigneeId: string;
  projectId: string;
  position: number;
  dueDate: string;
  description?: string;
};

export enum MemberRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

export type Member = Models.Document & {
  workspaceId: string;
  userId: string;
  role: MemberRole;
};
