import { useMutation, useQueryClient } from '@tanstack/react-query'
import { client } from '../../../lib/rpc'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type RequestType = InferRequestType<typeof client.api.members[":memberId"]["$patch"]>
type ResponseType = InferResponseType<typeof client.api.members[":memberId"]["$patch"]>

const useEditMember = () => {

    const queryClient = useQueryClient();
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ param, json }) => {
            const response = await client.api.members[":memberId"]["$patch"]({ param, json });
            const data = await response.json();

            if (!response.ok) throw new Error

            return data;
        },
        onSuccess: () => {
            toast.success("Member Updated");
            queryClient.invalidateQueries({ queryKey: ["members"] })
        },
        onError: ({ message }) => {
            toast.error(message || "Failed to update Member")
        },
    })

    return mutation;
}

export default useEditMember