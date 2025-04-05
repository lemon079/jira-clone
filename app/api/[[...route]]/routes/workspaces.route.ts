import { authMiddleware } from "@/lib/server/authMiddleware";
import {
  createWorkspaceValidationSchema,
  editWorkspaceValidationSchema,
} from "@/lib/validation-schema/workspaces-validation-schema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import {
  DATABASE_ID,
  IMAGES_BUCKET_ID,
  MEMBERS_ID,
  TASKS_ID,
  WORKSPACES_ID,
} from "@/constants";
import { generateInviteCode } from "@/lib/utils";
import { getMember } from "@/lib/server/member/queries";
import { z } from "zod";
import { MemberRole, TaskStatus, Workspace } from "@/app/types";
import { addMonths, endOfMonth, startOfMonth, subMonths } from "date-fns";

const app = new Hono()

  // GET endpoint to list user's workspaces
  .get("/", authMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    // List memberships for the current user.
    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
    ]);

    if (members.total === 0)
      return c.json({ data: { documents: [], total: 0 } });

    // Extract workspaceIds from member documents.
    const workspaceIds = members.documents.map((member) => member.workspaceId);

    // List workspaces that match the workspaceIds.
    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.orderDesc("$createdAt"), Query.equal("$id", workspaceIds)]
    );

    return c.json({ data: workspaces });
  })

  // POST endpoint to create a new workspace
  .post(
    "/",
    authMiddleware,
    zValidator("form", createWorkspaceValidationSchema),
    async (c) => {
      const { name, image } = c.req.valid("form");
      const databases = c.get("databases");
      const user = c.get("user");
      const storage = c.get("storage");

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
      const workspace = await databases.createDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        ID.unique(),
        {
          name,
          userId: user.$id,
          imageUrl: uploadedImage,
          inviteCode: generateInviteCode(10),
        }
      );

      // Create a membership document marking the creator as ADMIN.
      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        workspaceId: workspace.$id,
        userId: user.$id,
        role: MemberRole.ADMIN,
      });

      return c.json({ data: workspace });
    }
  )

  // PATCH endpoint to edit workspace details
  .patch(
    "/:workspaceId",
    authMiddleware,
    zValidator("form", editWorkspaceValidationSchema),
    async (c) => {
      const { name, image } = c.req.valid("form");
      const workspaceId = c.req.param("workspaceId");

      const storage = c.get("storage");
      const databases = c.get("databases");
      const user = c.get("user");

      const member = await getMember({
        userId: user.$id,
        workspaceId,
        databases,
      });

      // Throw error if the user is not an admin of the workspace.
      if (!member || member.role !== MemberRole.ADMIN) {
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

      const workspace = await databases.updateDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId,
        {
          name,
          imageUrl: uploadedImage,
        }
      );

      return c.json({ data: workspace });
    }
  )

  // DELETE endpoint to delete a workspace
  .delete("/:workspaceId", authMiddleware, async (c) => {
    const databases = c.get("databases");
    const workspaceId = c.req.param("workspaceId");
    const user = c.get("user");

    const member = await getMember({
      userId: user.$id,
      workspaceId,
      databases,
    });

    // Throw error if the user is not an admin.
    if (!member || member.role !== MemberRole.ADMIN) {
      throw new Error("Unauthorized");
    }

    await databases.deleteDocument(DATABASE_ID, WORKSPACES_ID, workspaceId);

    return c.json({
      data: {
        $id: workspaceId,
      },
    });
  })

  // POST endpoint to reset workspace invite code
  .post("/:workspaceId/reset-invite-code", authMiddleware, async (c) => {
    const databases = c.get("databases");
    const workspaceId = c.req.param("workspaceId");
    const user = c.get("user");

    const member = await getMember({
      userId: user.$id,
      workspaceId,
      databases,
    });

    // Throw error if the user is not an admin.
    if (!member || member.role !== MemberRole.ADMIN) {
      throw new Error("Unauthorized");
    }

    const workspace = await databases.updateDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId,
      {
        inviteCode: generateInviteCode(6),
      }
    );

    return c.json({ data: workspace });
  })

  // POST endpoint for joining a workspace via invite code
  .post(
    "/:workspaceId/join",
    authMiddleware,
    zValidator("json", z.object({ code: z.string() })),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const workspaceId: any = c.req.param("workspaceId");
      const { code } = c.req.valid("json");

      // Check if the user is already a member of the workspace.
      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId,
      });

      if (member) throw new Error("Already a member");

      // Get the workspace document.
      const workspace = await databases.getDocument<Workspace>(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId
      );

      // Throw error if the invite code does not match.
      if (code !== workspace.inviteCode) {
        throw new Error("Invalid Invite Code");
      }

      // Create a membership document marking the user as a MEMBER.
      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        workspaceId,
        userId: user.$id,
        role: MemberRole.MEMBER,
      });

      return c.json({ data: workspace });
    }
  )

  .get(
    "/:workspaceId",
    authMiddleware,
    zValidator("param", z.object({ workspaceId: z.string() })),
    async (c) => {
      const workspaceId = c.req.param("workspaceId");
      const databases = c.get("databases");
      const user = c.get("user");

      const existingWorkspace = await databases.getDocument<Workspace>(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId
      );

      const member = await getMember({
        userId: user.$id,
        workspaceId,
        databases,
      });

      if (!member) throw new Error("Unauthorized");

      return c.json({ data: existingWorkspace });
    }
  )
  .get(
    "/:workspaceId/info",
    authMiddleware,
    zValidator("param", z.object({ workspaceId: z.string() })),
    async (c) => {
      const workspaceId = c.req.param("workspaceId");
      const databases = c.get("databases");

      const workspace = await databases.getDocument<Workspace>(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId
      );

      return c.json({
        data: {
          $id: workspace.$id,
          name: workspace.name,
          inviteCode: workspace.inviteCode,
        },
      });
    }
  )
  .get("/:workspaceId/analytics", authMiddleware, async (c) => {
    const workspaceId = c.req.param("workspaceId");
    const databases = c.get("databases");
    const user = c.get("user");

    const member = await getMember({
      userId: user.$id,
      databases,
      workspaceId: workspaceId,
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
        Query.equal("workspaceId", workspaceId),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
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
        Query.equal("workspaceId", workspaceId),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthAssignedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("assigneeId", member.$id),
        Query.equal("workspaceId", workspaceId),
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
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthIncompleteTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
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
        Query.equal("workspaceId", workspaceId),
        Query.equal("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthCompletedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
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
        Query.equal("workspaceId", workspaceId),
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
        Query.equal("workspaceId", workspaceId),
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
