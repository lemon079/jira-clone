import { useMutation, useQueryClient } from '@tanstack/react-query'
import { client } from '../../../lib/rpc'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type RequestType = InferRequestType<typeof client.api.projects[":projectId"]["$delete"]>
type ResponseType = InferResponseType<typeof client.api.projects[":projectId"]["$delete"]>

const useDeleteProject = () => {

    const queryClient = useQueryClient();
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (param) => {
            const response = await client.api.projects[":projectId"]["$delete"](param);
            const data = await response.json();

            if (!response.ok) throw new Error

            return data;
        },
        onSuccess: () => {
            toast.success("Project Deleted");
            queryClient.invalidateQueries({ queryKey: ["projects"] })
        },
        onError: () => {
            toast.error("Failed to delete Project")
        },
    })

    return mutation;
}

export default useDeleteProject