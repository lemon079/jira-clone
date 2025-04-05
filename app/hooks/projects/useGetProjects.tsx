import { client } from '@/lib/rpc'
import { useQuery } from '@tanstack/react-query'

const useGetProjects = ({ workspaceId }: { workspaceId: string }) => {
    const query = useQuery({
        queryKey: ["projects"],
        queryFn: async () => {
            const response = await client.api.projects["$get"]({ query: { workspaceId } });

            if (!response.ok) throw new Error("Failed to fetch Projects");

            const { data } = await response.json();
            return data;
        }
    });

    return query;
}

export default useGetProjects;