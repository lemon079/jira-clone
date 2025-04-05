import { Project, TaskStatus } from "@/app/types";
import {
  DATABASE_ID,
  IMAGES_BUCKET_ID,
  PROJECTS_ID,
  TASKS_ID,
} from "@/constants";
import { authMiddleware } from "@/lib/server/authMiddleware";
import { getMember } from "@/lib/server/member/queries";
import {
  createProjectSchema,
  editProjectSchema,
} from "@/lib/validation-schema/projects-validation-schema";
import { zValidator } from "@hono/zod-validator";
import { addMonths, endOfMonth, startOfMonth, subMonths } from "date-fns";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";

const app = new Hono()
  .get(
    "/",
    authMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");

      const { workspaceId } = c.req.valid("query");

      const member = await getMember({
        userId: user.$id,
        workspaceId,
        databases,
      });

      if (!member) return c.json({ error: "Unauthorized" }, 401);

      const projects = await databases.listDocuments<Project>(DATABASE_ID, PROJECTS_ID, [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ]);

      return c.json({ data: projects });
    }
  )
  .post(
    "/",
    authMiddleware,
    zValidator("form", createProjectSchema),
    async (c) => {
      const { name, image, workspaceId } = c.req.valid("form");
      const databases = c.get("databases");
      const user = c.get("user");
      const storage = c.get("storage");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        throw new Error("Unauthorized");
      }

      let uploadedImage: string | undefined;

      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        );

        // Get file preview as an arrayBuffer.
        const arrayBuffer = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id
        );

        uploadedImage = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      }

      // Create a new workspace.
      const project = await databases.createDocument(
        DATABASE_ID,
        PROJECTS_ID,
        ID.unique(),
        {
          name,
          userId: user.$id,
          imageUrl: uploadedImage,
          workspaceId,
        }
      );

      console.log(project);

      return c.json({ data: project });
    }
  )
  .patch(
    "/:projectId",
    authMiddleware,
    zValidator("form", editProjectSchema),
    async (c) => {
      const { name, image } = c.req.valid("form");
      const projectId = c.req.param("projectId");

      const storage = c.get("storage");
      const databases = c.get("databases");
      const user = c.get("user");

      const existingProject = await databases.getDocument(
        DATABASE_ID,
        PROJECTS_ID,
        projectId
      );

      const member = await getMember({
        userId: user.$id,
        workspaceId: existingProject.workspaceId,
        databases,
      });

      // Throw error if the user is not an admin of the workspace.
      if (!member) {
        throw new Error("Unauthorized");
      }

      let uploadedImage: string | null;

      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        );

        // Get file preview as an arrayBuffer.
        const arrayBuffer = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id
        );

        uploadedImage = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      } else {
        // If no new image provided, keep the previous image.
        uploadedImage = null;
      }

      const project = await databases.updateDocument(
        DATABASE_ID,
        PROJECTS_ID,
        projectId,
        {
          name,
          imageUrl: uploadedImage,
        }
      );

      return c.json({ data: project });
    }
  )
  .delete(
    "/:projectId",
    authMiddleware,
    zValidator("param", z.object({ projectId: z.string() })),
    async (c) => {
      const projectId = c.req.param("projectId");
      const databases = c.get("databases");
      const user = c.get("user");

      const existingProject = await databases.getDocument(
        DATABASE_ID,
        PROJECTS_ID,
        projectId
      );

      const member = await getMember({
        userId: user.$id,
        workspaceId: existingProject.workspaceId,
        databases,
      });

      if (!member) throw new Error("Unauthorized");

      await databases.deleteDocument(DATABASE_ID, PROJECTS_ID, projectId);

      return c.json({ data: { $id: projectId } });
    }
  )
  .get(
    "/:projectId",
    authMiddleware,
    zValidator("param", z.object({ projectId: z.string() })),
    async (c) => {
      const projectId = c.req.param("projectId");
      const databases = c.get("databases");
      const user = c.get("user");

      const existingProject = await databases.getDocument<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectId
      );

      const member = await getMember({
        userId: user.$id,
        workspaceId: existingProject.workspaceId,
        databases,
      });

      if (!member) throw new Error("Unauthorized");

      return c.json({ data: existingProject });
    }
  )
  .get("/:projectId/analytics", authMiddleware, async (c) => {
    const projectId = c.req.param("projectId");
    const databases = c.get("databases");
    const user = c.get("user");

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    const member = await getMember({
      userId: user.$id,
      databases,
      workspaceId: project.workspaceId,
    });

    if (!member) throw new Error("Unauthorized");

    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(addMonths(now, 1));

    const thisMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const tasksCount = thisMonthTasks.total;
    const tasksDifference = tasksCount - lastMonthTasks.total;

    const thisMonthAssignedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("assigneeId", member.$id),
        Query.equal("projectId", projectId),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthAssignedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("assigneeId", member.$id),
        Query.equal("projectId", projectId),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const assignedTasksCount = thisMonthAssignedTasks.total;
    const assignedTasksDifference = tasksCount - lastMonthAssignedTasks.total;

    const thisMonthIncompleteTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthIncompleteTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const incompleteTasksCount = thisMonthIncompleteTasks.total;
    const incompleteTasksDifference =
      tasksCount - lastMonthIncompleteTasks.total;

    const thisMonthCompletedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.equal("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthCompletedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.equal("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const completedTasksCount = thisMonthCompletedTasks.total;
    const completedTasksDifference = tasksCount - lastMonthCompletedTasks.total;

    const thisMonthOverdueTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.lessThan("dueDate", now.toISOString()), // if duedate is past current time when user logs
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthOverdueTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.lessThan("dueDate", now.toISOString()), // if duedate is past current time when user logs
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const overdueTasksCount = thisMonthOverdueTasks.total;
    const overdueTasksDifference = tasksCount - lastMonthOverdueTasks.total;

    return c.json({
      data: {
        tasksCount,
        tasksDifference,
        assignedTasksCount,
        assignedTasksDifference,
        completedTasksCount,
        completedTasksDifference,
        incompleteTasksCount,
        incompleteTasksDifference,
        overdueTasksCount,
        overdueTasksDifference,
      },
    });
  });

export default app;
