import { client } from '@/lib/rpc'
import { useQuery } from "@tanstack/react-query";

const useCurrent = () => {
    const query = useQuery({
        queryKey: ["current"],
        queryFn: async () => {
            const response = await client.api.auth.current["$get"]();

            if (!response.ok) {
                return null;
            }

            const { data } = await response.json();
            return data
        }
    })
    return query;
}

export default useCurrent


// used response.ok because the client from @/lib/rpc uses fetch . we use try catch block when using axios