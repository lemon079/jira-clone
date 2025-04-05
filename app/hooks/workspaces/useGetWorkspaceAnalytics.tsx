import { client } from '@/lib/rpc'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono';

export type WorkspaceAnalyticsResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]["analytics"]["$get"]>

const useGetWorkspaceAnalytics = ({ workspaceId }: { workspaceId: string }) => {
    const query = useQuery({
        queryKey: ["project-analytics"],
        queryFn: async () => {
            const response = await client.api.workspaces[":workspaceId"]["analytics"]["$get"]({ param: { workspaceId } });

            if (!response.ok) throw new Error("Failed to fetch Workspace Analytics");

            const { data } = await response.json();
            return data;
        }
    });

    return query;
}

export default useGetWorkspaceAnalytics