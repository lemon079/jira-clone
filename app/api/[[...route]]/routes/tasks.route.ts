import { Project, Task } from "@/app/types";
import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } from "@/constants";
import { createAdminClient } from "@/lib/server/appwrite";
import { authMiddleware } from "@/lib/server/authMiddleware";
import { getMember } from "@/lib/server/member/queries";
import { createTaskFormSchema } from "@/lib/validation-schema/tasks-validation-schema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { TaskStatus } from "@/app/types";

const app = new Hono()
  .post(
    "/",
    authMiddleware,
    zValidator("json", createTaskFormSchema),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const {
        workspaceId,
        projectId,
        assigneeId,
        name,
        description,
        status,
        dueDate,
      } = c.req.valid("json");

      const member = await getMember({
        userId: user.$id,
        workspaceId,
        databases,
      });

      if (!member) {
        throw new Error("Unauthorized");
      }

      const highestPositionTask = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("workspaceId", workspaceId),
          Query.equal("status", status),
          Query.orderAsc("position"),
          Query.limit(1),
        ]
      );

      const newPosition =
        highestPositionTask.documents.length > 0
          ? highestPositionTask.documents[0].position + 1000
          : 1000;

      const task = await databases.createDocument(
        DATABASE_ID,
        TASKS_ID,
        ID.unique(),
        {
          name,
          projectId,
          workspaceId,
          assigneeId,
          description,
          dueDate,
          status,
          position: newPosition,
        }
      );

      return c.json({ data: task });
    }
  )
  .get(
    "/",
    authMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
        projectId: z.string().nullish(),
        assigneeId: z.string().nullish(),
        status: z.nativeEnum(TaskStatus).nullish(),
        search: z.string().nullish(),
        dueDate: z.string().nullish(),
      })
    ),
    async (c) => {
      // Create an admin client instance to fetch user details later
      const { users } = await createAdminClient();
      // Retrieve the authenticated user and the databases instance from the context
      const user = c.get("user");
      const databases = c.get("databases");

      // Extract and validate the query parameters from the request
      const { workspaceId, assigneeId, dueDate, projectId, search, status } =
        c.req.valid("query");

      // Check if the current user is a member of the specified workspace
      const member = await getMember({
        userId: user.$id,
        workspaceId,
        databases,
      });

      // If not a member, return an Unauthorized response
      if (!member) return c.json({ error: "Unauthorized" }, 401);

      // Start building the query to fetch tasks by filtering with workspaceId and ordering by creation date (desc)
      const query = [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ];

      // If projectId is provided, add it to the query filter
      if (projectId) {
        console.log("projectId: ", projectId);
        query.push(Query.equal("projectId", projectId));
      }

      // If assigneeId is provided, add it to the query filter
      if (assigneeId) {
        console.log("assigneeId: ", assigneeId);
        query.push(Query.equal("assigneeId", assigneeId));
      }

      // If search term is provided, add it to the query filter
      if (search) {
        console.log("search: ", search);
        query.push(Query.search("name", search));
      }

      // If status is provided, add it to the query filter (note: added twice, which might be redundant)
      if (status) {
        console.log("status: ", status);
        query.push(Query.equal("status", status));
      }

      // If dueDate is provided, add it to the query filter
      if (dueDate) {
        console.log("dueDate: ", dueDate);
        query.push(Query.equal("dueDate", dueDate));
      }

      // Fetch the list of tasks based on the constructed query
      const tasks = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        query
      );

      // Extract projectIds and assigneeIds from the fetched tasks
      const projectIds = tasks.documents.map((task) => task.projectId);
      const assigneeIds = tasks.documents.map((task) => task.assigneeId);

      // Query the projects collection to get details for each project associated with tasks
      const projects = await databases.listDocuments<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectIds.length > 0 ? [Query.contains("$id", projectIds)] : []
      );

      // Query the members collection to get details for each assignee
      const members = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        assigneeIds.length > 0 ? [Query.contains("$id", assigneeIds)] : []
      );

      // For each member, use the admin client to retrieve additional user details (name and email)
      const assignees = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);
          return {
            ...member,
            name: user.name,
            email: user.email,
          };
        })
      );

      // Populate each task with its corresponding project and assignee details
      const populatedTasks = tasks.documents.map((task) => {
        const project = projects.documents.find(
          (project) => project.$id === task.projectId
        );
        const assignee = assignees.find(
          (assignee) => assignee.$id === task.assigneeId
        );
        return {
          ...task,
          project,
          assignee,
        };
      });

      // Return the tasks along with the additional populated details in a JSON response
      return c.json({
        data: {
          ...tasks,
          documents: populatedTasks,
        },
      });
    }
  )
  .delete("/:taskId", authMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const taskId = c.req.param("taskId");

    const task = await databases.getDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      taskId
    );

    const member = await getMember({
      userId: user.$id,
      workspaceId: task.workspaceId,
      databases,
    });

    if (!member) throw new Error("Unauthorized");

    await databases.deleteDocument(DATABASE_ID, TASKS_ID, task.$id);

    return c.json({
      data: {
        $id: task.$id,
      },
    });
  })
  .patch(
    "/:taskId",
    authMiddleware,
    zValidator("json", createTaskFormSchema.partial()),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const { projectId, assigneeId, name, description, status, dueDate } =
        c.req.valid("json");
      const taskId = c.req.param("taskId");
      const existingTask = await databases.getDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        taskId
      );

      const member = await getMember({
        userId: user.$id,
        workspaceId: existingTask.workspaceId,
        databases,
      });

      if (!member) {
        throw new Error("Unauthorized");
      }

      const task = await databases.updateDocument(
        DATABASE_ID,
        TASKS_ID,
        taskId,
        {
          name,
          projectId,
          assigneeId,
          description,
          dueDate,
          status,
        }
      );

      return c.json({ data: task });
    }
  )
  .get("/:taskId", authMiddleware, async (c) => {
    const currentUser = c.get("user");
    const databases = c.get("databases");
    const taskId = c.req.param("taskId");

    const { users } = await createAdminClient();

    const task = await databases.getDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      taskId
    );

    const currentMember = await getMember({
      userId: currentUser.$id,
      workspaceId: task.workspaceId,
      databases,
    });

    if (!currentMember) throw new Error("Unauthorized");

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      task.projectId
    );

    const member = await databases.getDocument(
      DATABASE_ID,
      MEMBERS_ID,
      task.assigneeId
    );

    const user = await users.get(member.userId);

    const assignee = {
      ...member,
      name: user.name,
      email: user.email,
    };

    return c.json({
      data: {
        ...task,
        project,
        assignee,
      },
    });
  })
  .post(
    "/bulk-update",
    authMiddleware,
    zValidator(
      "json",
      z.object({
        tasks: z.array(
          z.object({
            $id: z.string(),
            status: z.nativeEnum(TaskStatus),
            position: z.number().int().positive().min(1000).max(1_000_000),
          })
        ),
      })
    ),
    async (c) => {
      const databases = c.get("databases");
      const { tasks } = c.req.valid("json");
      const user = c.get("user");

      const tasksToUpdate = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.contains(
            "$id",
            tasks.map((task) => task.$id)
          ),
        ]
      );

      const workspaceIds = new Set(
        tasksToUpdate.documents.map((task) => task.workspaceId)
      );

      if (workspaceIds.size !== 1) {
        throw new Error("All tasks must belong to same workspace");
      }

      const workspaceId: any = workspaceIds.values().next().value;

      const member = await getMember({
        userId: user.$id,
        workspaceId,
        databases,
      });

      if (!member) {
        throw new Error("Unauthorized");
      }

      const updatedTasks = await Promise.all(
        tasks.map((task) => {
          return databases.updateDocument(DATABASE_ID, TASKS_ID, task.$id, {
            status: task.status,
            position: task.position,
          });
        })
      );

      return c.json({ data: updatedTasks });
    }
  )

export default app;
