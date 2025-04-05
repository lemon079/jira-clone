import MembersList from '@/components/members/MembersList';
import { getCurrentUser } from '@/lib/server/auth/queries'
import { redirect } from 'next/navigation';
import React from 'react'

const page = async () => {
    
    const user = await getCurrentUser();

    if (!user) redirect("/sign-in");

    return (
        <div className='size-full lg:max-w-xl'>
            <MembersList />
        </div>
    )
}

export default page