import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from 'hono'
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type RequestType = InferRequestType<typeof client.api.auth.register["$post"]>
type ResponseType = InferResponseType<typeof client.api.auth.register["$post"]>

export const useRegister = () => {

    const router = useRouter();
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (payload) => {
            const response = await client.api.auth.register["$post"](payload);

            if (!response.ok) throw new Error

            const data = response.json();
            return data;
        },
        onSuccess: () => {
            toast.success("Registered Successfully", {
                position: "top-center"
            }),
            router.refresh()
            queryClient.invalidateQueries({ queryKey: ["current"] });
        },
        onError: () => {
            toast.error("Failed to Register", {
                position: "top-center"
            });
        }
    })

    return mutation;

}