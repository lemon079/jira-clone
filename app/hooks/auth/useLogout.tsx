import { client } from '@/lib/rpc'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferResponseType } from 'hono'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type ResponseType = InferResponseType<typeof client.api.auth.logout["$post"]>

const useLogout = () => {

    const queryClient = useQueryClient()
    const router = useRouter();

    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async () => {
            const response = await client.api.auth.logout["$post"]();

            if (!response.ok) throw new Error

            const data = await response.json();

            return data;
        },
        onSuccess: () => {
            toast.success("Logged Out Successfully", {
                position: "top-center"
            });
            window.location.href = "/sign-in";
            queryClient.invalidateQueries({ queryKey: ["current"] })
            queryClient.invalidateQueries({ queryKey: ["workspaces"] })
        },
        onError: () => {
            toast.error("Failed to Log Out", {
                position: "top-center"
            });
        }
    })

    return mutation;
}

export default useLogout;