"use client";
import useGetTask from '@/app/hooks/tasks/useGetTask';
import useTaskId from '@/app/hooks/tasks/useTaskId';
import PageError from '@/components/ui/page-error';
import TaskBreadcrumbs from '@/components/tasks/TaskBreadcrumbs';
import TaskDescription from '@/components/tasks/TaskDescription';
import TaskOverview from '@/components/tasks/TaskOverview';
import PageLoader from '@/components/ui/page-loader';
import { Separator } from '@/components/ui/separator';
import React from 'react'

const TaskIdClient = () => {
    const taskId = useTaskId();
    const { data, isLoading } = useGetTask({ taskId });

    if (isLoading) return <PageLoader />

    if (!data) return <PageError message='Task Not Found' />

    return (
        <div className='flex flex-col'>
            <TaskBreadcrumbs project={data.project} task={data} />
            <Separator className='my-6' />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <TaskOverview task={data} />
                <TaskDescription task={data} />
            </div>
        </div>
    )
}

export default TaskIdClient