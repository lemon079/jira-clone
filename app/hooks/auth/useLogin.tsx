import { client } from "@/lib/rpc";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type RequestType = InferRequestType<typeof client.api.auth.login["$post"]>
type ResponseType = InferResponseType<typeof client.api.auth.login["$post"]>

export const useLogin = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (payload) => {
            const response = await client.api.auth.login["$post"](payload);

            if (!response.ok) throw new Error

            const data = await response.json();
            return data;
        },
        onSuccess: () => {
            toast.success("Logged In Successfully", {
                position: "top-center"
            });
            router.refresh();
            queryClient.invalidateQueries({ queryKey: ["current"] });
        },
        onError: () => {
            toast.error("Failed to Log in", {
                position: "top-center"
            });
        }
    })

    return mutation;
}
