import { getCurrentUser } from '@/lib/server/auth/queries'
import { redirect } from 'next/navigation';
import ProjectIdClient from './client';

const page = async () => {
    const user = await getCurrentUser();

    if (!user) redirect("sign-in")

    return (
        <ProjectIdClient />
    )
}

export default page