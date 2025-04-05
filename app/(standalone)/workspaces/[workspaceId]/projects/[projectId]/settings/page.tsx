import EditProjectFormClient from '@/components/projects/EditProjectForm';
import { getCurrentUser } from '@/lib/server/auth/queries'
import { redirect } from 'next/navigation';
import React from 'react'

const page = async () => {

    const user = getCurrentUser();

    if (!user) redirect("sign-in");

    return (
        <div className='w-full lg:max-w-xl'>
            <EditProjectFormClient />
        </div>
    )
}

export default page