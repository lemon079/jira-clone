import TaskViewSwitcher from '@/components/tasks/TaskViewSwitcher';
import { getCurrentUser } from '@/lib/server/auth/queries'
import { redirect } from 'next/navigation';
import React from 'react'

const page = async () => {
    const user = getCurrentUser();
    if (!user) redirect("/sign-in")

    return (
        <div className='h-full flex flex-col'>
            <TaskViewSwitcher hideProjectFilter={false} />
        </div>
    )
}

export default page