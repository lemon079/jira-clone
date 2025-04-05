import { useMutation, useQueryClient } from '@tanstack/react-query'
import { client } from '../../../lib/rpc'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type RequestType = InferRequestType<typeof client.api.members[":memberId"]["$delete"]>
type ResponseType = InferResponseType<typeof client.api.members[":memberId"]["$delete"]>

const useDeleteMember = () => {

    const queryClient = useQueryClient();
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ param }) => {
            const response = await client.api.members[":memberId"]["$delete"]({ param });
            const data = await response.json();

            if (!response.ok) throw new Error;

            return data;
        },
        onSuccess: () => {
            toast.success("Member Deleted");
            queryClient.invalidateQueries({ queryKey: ["members"] })
        },
        onError: () => {
            toast.error("Failed to Delete Member")
        },
    })

    return mutation;
}

export default useDeleteMember