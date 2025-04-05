import React from 'react'
import SignUpCard from '@/components/auth/SignUpCard'
import { getCurrentUser } from '@/lib/server/auth/queries';
import { redirect } from 'next/navigation';

const page = async () => {
    const user = await getCurrentUser();

    if (user) redirect("/")

    return (
        <SignUpCard />
    )
}

export default page