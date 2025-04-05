import { useMutation, useQueryClient } from '@tanstack/react-query'
import { client } from '../../../lib/rpc'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type RequestType = InferRequestType<typeof client.api.tasks["$post"]>
type ResponseType = InferResponseType<typeof client.api.tasks["$post"], 200>

const useCreateTask = () => {

    const queryClient = useQueryClient();
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ json }) => {
            const response = await client.api.tasks["$post"]({ json })
            const data = await response.json();

            if (!response.ok) throw new Error("Failed to create Task")

            return data;
        },
        onSuccess: ({ data }) => {
            toast.success("Task Created");
            queryClient.invalidateQueries({ queryKey: ["tasks"] })
            queryClient.invalidateQueries({ queryKey: ["tasks", data.$id] })
            queryClient.invalidateQueries({ queryKey: ["project-analytics"] });
            queryClient.invalidateQueries({ queryKey: ["workspace-analytics"] });
        },
        onError: () => {
            toast.error("Failed to create Task")
        },
    })

    return mutation;
}

export default useCreateTask