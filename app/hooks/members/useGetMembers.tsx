import { client } from '@/lib/rpc'
import { useQuery } from '@tanstack/react-query'

const useGetMembers = ({ workspaceId }: { workspaceId: string }) => {
    const query = useQuery({
        queryKey: ["members", workspaceId], // only invalidate members api when the workspace is changed
        queryFn: async () => {
            const response = await client.api.members["$get"]({ query: { workspaceId } });

            if (!response.ok) throw new Error("Failed to fetch Members");

            const { data } = await response.json();
            return data;
        }
    });

    return query;
}

export default useGetMembers