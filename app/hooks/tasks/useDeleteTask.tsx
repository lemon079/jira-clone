import { useMutation, useQueryClient } from '@tanstack/react-query'
import { client } from '../../../lib/rpc'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type RequestType = InferRequestType<typeof client.api.tasks[":taskId"]["$delete"]>
type ResponseType = InferResponseType<typeof client.api.tasks[":taskId"]["$delete"], 200>

const useDeleteTask = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (param) => {
            const response = await client.api.tasks[":taskId"]["$delete"](param);
            const data = await response.json();

            if (!response.ok) throw new Error

            return data;
        },
        onSuccess: () => {
            toast.success("Task Deleted");
            queryClient.invalidateQueries({ queryKey: ["tasks"] })
            queryClient.invalidateQueries({ queryKey: ["project-analytics"] });
            queryClient.invalidateQueries({ queryKey: ["workspace-analytics"] });
        },
        onError: () => {
            toast.error("Failed to delete Task")
        },
    })

    return mutation;
}

export default useDeleteTask