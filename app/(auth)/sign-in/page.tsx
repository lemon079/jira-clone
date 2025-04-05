import SignInCard from '@/components/auth/SignInCard'
import { getCurrentUser } from '@/lib/server/auth/queries'
import { redirect } from 'next/navigation';

const page = async () => {
    const user = await getCurrentUser();

    if (user) redirect("/")

    return (
        <SignInCard />
    )
}

export default page