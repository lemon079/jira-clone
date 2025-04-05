import { client } from '@/lib/rpc'
import { useQuery } from '@tanstack/react-query'

const useGetProject = ({ projectId }: { projectId: string }) => {
    const query = useQuery({
        queryKey: ["project", projectId],
        queryFn: async () => {
            const response = await client.api.projects[":projectId"]["$get"]({ param: { projectId } });

            if (!response.ok) throw new Error("Failed to fetch Project");

            const { data } = await response.json();
            return data;
        }
    });

    return query;
}

export default useGetProject