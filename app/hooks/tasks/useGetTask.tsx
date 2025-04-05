import { client } from '@/lib/rpc'
import { useQuery } from '@tanstack/react-query'

const useGetTask = ({ taskId }: { taskId: string }) => {
    const query = useQuery({
        queryKey: ["task", taskId],
        queryFn: async () => {
            const response = await client.api.tasks[":taskId"]["$get"]({ param: { taskId } });

            if (!response.ok) throw new Error("Failed to fetch Task");

            const { data } = await response.json();
            return data;
        }
    });

    return query;
}

export default useGetTask