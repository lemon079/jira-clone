"use client";
import useGetWorkspace from "@/app/hooks/workspaces/useGetWorkspace";
import useWorkspaceId from "@/app/hooks/workspaces/useWorkspaceId";
import PageError from "@/components/ui/page-error";
import PageLoader from "@/components/ui/page-loader";
import EditWorkspaceForm from "@/components/workspace/EditWorkspaceForm";

const EditWorkspaceFormClient = () => {
    const workspaceId = useWorkspaceId();
    const { data: workspace, isLoading } = useGetWorkspace({ workspaceId })

    if (isLoading) return <PageLoader />
    if (!workspace) return <PageError message="Workspace Not Found" />

    return (
        <div className="w-full lg:max-w-lg">
            <EditWorkspaceForm initialValues={workspace} />
        </div>
    )
}
export default EditWorkspaceFormClient;
