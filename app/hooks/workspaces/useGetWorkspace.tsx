import { client } from '@/lib/rpc'
import { useQuery } from '@tanstack/react-query'

const useGetWorkspace = ({ workspaceId }: { workspaceId: string }) => {
    const query = useQuery({
        queryKey: ["workspace", workspaceId],
        queryFn: async () => {
            const response = await client.api.workspaces[":workspaceId"]["$get"]({ param: { workspaceId } });

            if (!response.ok) throw new Error("Failed to fetch Task");

            const { data } = await response.json();
            return data;
        }
    });

    return query;
}

export default useGetWorkspace