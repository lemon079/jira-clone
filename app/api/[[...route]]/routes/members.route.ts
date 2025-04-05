import { Member, MemberRole } from "@/app/types";
import { DATABASE_ID, MEMBERS_ID } from "@/constants";
import { createAdminClient } from "@/lib/server/appwrite";
import { authMiddleware } from "@/lib/server/authMiddleware";
import { getMember } from "@/lib/server/member/queries";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { Query } from "node-appwrite";
import { z } from "zod";

const app = new Hono()
  .get(
    "/",
    authMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      const { users } = await createAdminClient();
      const databases = c.get("databases");
      const user = c.get("user");
      const { workspaceId } = c.req.valid("query");

      const member = await getMember({
        userId: user.$id,
        workspaceId,
        databases,
      });

      if (!member) return c.json({ error: "Unauthorized" }, 401);

      const members = await databases.listDocuments<Member>(
        DATABASE_ID,
        MEMBERS_ID,
        [Query.equal("workspaceId", workspaceId)]
      );

      const populatedMembers = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);
          return {
            ...member,
            name: user.name,
            email: user.email,
          };
        })
      );

      return c.json({
        data: {
          ...member,
          documents: populatedMembers,
        },
      });
    }
  )
  .delete("/:memberId", authMiddleware, async (c) => {
    const memberId = c.req.param("memberId");
    const user = c.get("user");
    const databases = c.get("databases");

    const memberToDelete = await databases.getDocument(
      DATABASE_ID,
      MEMBERS_ID,
      memberId
    );

    const allMembersInWorkspace = await databases.listDocuments(
      DATABASE_ID,
      MEMBERS_ID,
      [Query.equal("workspaceId", memberToDelete.workspaceId)]
    );

    const member = await getMember({
      userId: user.$id,
      workspaceId: memberToDelete.workspaceId,
      databases,
    });

    if (!member) return c.json({ error: "Unauthorized" }, 401);
    if (member.$id !== memberToDelete.$id && member.role !== MemberRole.ADMIN)
      return c.json({ error: "Unauthorized" }, 401);
    if (allMembersInWorkspace.total === 1)
      return c.json({ error: "Cannot delete the only member" }, 400);

    await databases.deleteDocument(DATABASE_ID, MEMBERS_ID, memberId);

    return c.json({
      data: {
        $id: memberToDelete.$id,
      },
    });
  })
  .patch(
    "/:memberId",
    authMiddleware,
    zValidator(
      "json",
      z.object({
        role: z.nativeEnum(MemberRole),
      })
    ),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const memberId = c.req.param("memberId");
      const { role } = c.req.valid("json");

      // Retrieve the document for the member to be updated.
      const memberToUpdate = await databases.getDocument(
        DATABASE_ID,
        MEMBERS_ID,
        memberId
      );

      // Verify the authenticated user is a member of the same workspace.
      const member = await getMember({
        userId: user.$id,
        workspaceId: memberToUpdate.workspaceId,
        databases,
      });

      // List all members in the workspace.
      const allMembersInWorkspace = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        [Query.equal("workspaceId", member.workspaceId)]
      );

      if (!member) return c.json({ error: "Unauthorized" }, 401);
      if (member.role !== MemberRole.ADMIN)
        return c.json({ error: "Unauthorized" }, 401);
      if (allMembersInWorkspace.total === 1)
        return c.json({ error: "Cannot downgrade the only member" }, 400);

      // Update the member's role.
      await databases.updateDocument(DATABASE_ID, MEMBERS_ID, memberId, {
        role,
      });

      return c.json({ data: { $id: memberToUpdate.$id } });
    }
  );

export default app;
