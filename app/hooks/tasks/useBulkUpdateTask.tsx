import { useMutation, useQueryClient } from '@tanstack/react-query'
import { client } from '../../../lib/rpc'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type RequestType = InferRequestType<typeof client.api.tasks["bulk-update"]["$post"]>
type ResponseType = InferResponseType<typeof client.api.tasks["bulk-update"]["$post"], 200>

const useBulkUpdateTask = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ json }) => {
            const response = await client.api.tasks["bulk-update"]["$post"]({ json })
            const data = await response.json();

            if (!response.ok) throw new Error("Failed to update tasks")

            return data;
        },
        onSuccess: () => {
            toast.success("Tasks Updated");
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            queryClient.invalidateQueries({ queryKey: ["project-analytics"] });
            queryClient.invalidateQueries({ queryKey: ["workspace-analytics"] });
        },
        onError: () => {
            toast.error("Failed to edit Task")
        },
    })

    return mutation;
}

export default useBulkUpdateTask