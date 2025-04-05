import { useMutation, useQueryClient } from '@tanstack/react-query'
import { client } from '../../../lib/rpc'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type RequestType = InferRequestType<typeof client.api.tasks[":taskId"]["$patch"]>
type ResponseType = InferResponseType<typeof client.api.tasks[":taskId"]["$patch"], 200>

const useEditTask = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ json, param }) => {
            const response = await client.api.tasks[":taskId"]["$patch"]({ json, param })
            const data = await response.json();

            if (!response.ok) throw new Error("Failed to edit Task")

            return data;
        },
        onSuccess: ({ data }) => {
            toast.success("Task edited");
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            queryClient.invalidateQueries({ queryKey: ["task", data.$id] });
            queryClient.invalidateQueries({ queryKey: ["project-analytics"] });
        },
        onError: () => {
            toast.error("Failed to edit Task")
        },
    })

    return mutation;
}

export default useEditTask