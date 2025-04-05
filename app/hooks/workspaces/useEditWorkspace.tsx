import { client } from '@/lib/rpc'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type RequestType = InferRequestType<typeof client.api.workspaces[":workspaceId"]["$patch"]>
type ResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]["$patch"], 200>

const useEditWorkspace = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ form, param }) => {
            const response = await client.api.workspaces[":workspaceId"]["$patch"]({ form, param });

            if (!response.ok) throw new Error;

            const data = await response.json();
            return data;
        },
        onSuccess: ({ data }) => {
            toast.success("Workspace Edited");
            queryClient.invalidateQueries({ queryKey: ["workspaces"] })
            queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] })
        },
        onError: () => {
            toast.error("Failed to edit Workspace")
        },
    })

    return mutation;
}

export default useEditWorkspace;