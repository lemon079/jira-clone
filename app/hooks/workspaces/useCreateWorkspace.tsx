import { useMutation, useQueryClient } from '@tanstack/react-query'
import { client } from '../../../lib/rpc'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type RequestType = InferRequestType<typeof client.api.workspaces["$post"]>
type ResponseType = InferResponseType<typeof client.api.workspaces["$post"], 200>

const useCreateWorkspace = () => {

    const queryClient = useQueryClient();
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (payload) => {
            const response = await client.api.workspaces["$post"](payload)
            const data = await response.json();

            if (!response.ok) throw new Error

            return data;
        },
        onSuccess: () => {
            toast.success("Workspace Created");
            queryClient.invalidateQueries({ queryKey: ["workspaces"] })
        },
        onError: () => {
            toast.error("Failed to create Workspace")
        },
    })

    return mutation;
}

export default useCreateWorkspace