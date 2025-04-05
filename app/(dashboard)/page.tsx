import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/server/auth/queries";
import { getWorkSpaces } from "@/lib/server/workspace/queries"

export default async function Home() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const workspaces = await getWorkSpaces();
  if (workspaces?.total === 0) {
    redirect('/workspaces/create')
  } else {
    redirect(`/workspaces/${workspaces?.documents[workspaces?.total - 1].$id}`) // to get the latest workspace created
  }

}
