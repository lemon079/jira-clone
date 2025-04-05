import { useMutation, useQueryClient } from '@tanstack/react-query'
import { client } from '../../../lib/rpc'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type RequestType = InferRequestType<typeof client.api.workspaces[":workspaceId"]["$delete"]>
type ResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]["$delete"]>

const useDeleteWorkspace = () => {

    const queryClient = useQueryClient();
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (param) => {
            const response = await client.api.workspaces[":workspaceId"]["$delete"](param);
            const data = await response.json();

            if (!response.ok) throw new Error

            return data;
        },
        onSuccess: ({ data }) => {
            toast.success("Workspace Deleted");
            queryClient.invalidateQueries({ queryKey: ["workspaces"] })
            queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] })
        },
        onError: () => {
            toast.error("Failed to delete Workspace")
        },
    })

    return mutation;
}

export default useDeleteWorkspace