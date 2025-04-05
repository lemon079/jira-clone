import { client } from '@/lib/rpc'
import { useQuery } from '@tanstack/react-query'
import { InferResponseType } from 'hono';

export type ProjectAnalyticsResponseType = InferResponseType<typeof client.api.projects[":projectId"]["analytics"]["$get"]>

const useGetProjectAnalytics = ({ projectId }: { projectId: string }) => {
    const query = useQuery({
        queryKey: ["project-analytics"],
        queryFn: async () => {
            const response = await client.api.projects[":projectId"]["analytics"]["$get"]({ param: { projectId } });

            if (!response.ok) throw new Error("Failed to fetch Project Analytics");

            const { data } = await response.json();
            return data;
        }
    });

    return query;
}

export default useGetProjectAnalytics