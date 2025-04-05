import { client } from '@/lib/rpc'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type RequestType = InferRequestType<typeof client.api.projects[":projectId"]["$patch"]>
type ResponseType = InferResponseType<typeof client.api.projects[":projectId"]["$patch"], 200>

const useEditProject = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ form, param }) => {
            const response = await client.api.projects[":projectId"]["$patch"]({ form, param });

            if (!response.ok) throw new Error;

            const data = await response.json();
            return data;
        },
        onSuccess: ({ data }) => {
            toast.success("Project Edited");
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({ queryKey: ["project", data.$id] });
        },
        onError: () => {
            toast.error("Failed to edit Project")
        },
    })

    return mutation;
}

export default useEditProject;