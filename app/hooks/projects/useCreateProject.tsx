import { useMutation, useQueryClient } from '@tanstack/react-query'
import { client } from '../../../lib/rpc'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type RequestType = InferRequestType<typeof client.api.projects["$post"]>
type ResponseType = InferResponseType<typeof client.api.projects["$post"], 200>

const useCreateProject = () => {

    const queryClient = useQueryClient();
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (payload) => {
            const response = await client.api.projects["$post"](payload)
            const data = await response.json();

            if (!response.ok) throw new Error("Failed to create Project")

            return data;
        },
        onSuccess: () => {
            toast.success("Project Created");
            queryClient.invalidateQueries({ queryKey: ["projects"] })
        },
        onError: () => {
            toast.error("Failed to create Project")
        },
    })

    return mutation;
}

export default useCreateProject