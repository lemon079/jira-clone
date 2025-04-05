import { useMutation, useQueryClient } from '@tanstack/react-query'
import { client } from '../../../lib/rpc'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type RequestType = InferRequestType<typeof client.api.workspaces[":workspaceId"]["reset-invite-code"]["$post"]>
type ResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]["reset-invite-code"]["$post"], 200>

const useResetInviteCode = () => {

    const queryClient = useQueryClient();
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (param) => {
            const response = await client.api.workspaces[":workspaceId"]["reset-invite-code"]["$post"](param);
            const data = await response.json();

            if (!response.ok) throw new Error

            return data;
        },
        onSuccess: ({ data }) => {
            toast.success("Invite Code Reset");
            queryClient.invalidateQueries({ queryKey: ["workspaces"] })
            queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] })
        },
        onError: () => {
            toast.error("Failed to reset Invite Code")
        },
    })

    return mutation;
}

export default useResetInviteCode