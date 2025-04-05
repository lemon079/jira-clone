import React from 'react'
import TaskIdClient from './client';
import { getCurrentUser } from '@/lib/server/auth/queries';
import { redirect } from 'next/navigation';

const page = async () => {
    const user = getCurrentUser();
    if (!user) redirect("/sign-in")

    return (
        <div>
            <TaskIdClient />
        </div>
    )
}

export default page