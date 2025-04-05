import { useMutation, useQueryClient } from '@tanstack/react-query'
import { client } from '../../../lib/rpc'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type RequestType = InferRequestType<typeof client.api.workspaces[":workspaceId"]["join"]["$post"]>
type ResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]["join"]["$post"], 200>

const useJoinWorkspace = () => {

    const queryClient = useQueryClient();
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ param, json }) => {
            const response = await client.api.workspaces[":workspaceId"]["join"]["$post"]({ param, json });
            const data = await response.json();

            if (!response.ok) throw new Error

            return data;
        },
        onSuccess: ({ data }) => {
            toast.success("Joined Workspace");
            queryClient.invalidateQueries({ queryKey: ["workspaces"] })
            queryClient.invalidateQueries({ queryKey: ["workspaces", data.$id] })
        },
        onError: () => {
            toast.error("Failed to Join Workspace")
        },
    })

    return mutation;
}

export default useJoinWorkspace;