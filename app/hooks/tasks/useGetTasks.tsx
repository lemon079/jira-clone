import { TaskStatus } from '@/app/types';
import { client } from '@/lib/rpc'
import { useQuery } from '@tanstack/react-query'


interface GetTasksProps {
    workspaceId: string;
    projectId?: string | null;
    status?: TaskStatus | null; // Enforces valid statuses
    assigneeId?: string | null;
    dueDate?: string | null;
    search?: string | null;
}


const useGetTasks = ({ workspaceId, projectId, assigneeId, dueDate, status, search }: GetTasksProps) => {
    const query = useQuery({
        queryKey: ["tasks", workspaceId, projectId, assigneeId, dueDate, status, search],
        queryFn: async () => {
            const response = await client.api.tasks["$get"]({
                query: {
                    workspaceId,
                    projectId: projectId ?? undefined,
                    assigneeId: assigneeId ?? undefined,
                    search: search ?? undefined,
                    dueDate: dueDate ?? undefined,
                    status: status ?? undefined,
                }
            });

            if (!response.ok) throw new Error("Failed to fetch Tasks");

            const { data } = await response.json();
            return data;
        }
    });

    return query;
}

export default useGetTasks