import React from 'react'
import useGetMembers from '@/app/hooks/members/useGetMembers';
import useGetProjects from '@/app/hooks/projects/useGetProjects'
import useWorkspaceId from '@/app/hooks/workspaces/useWorkspaceId';
import { Card, CardContent } from '../ui/card';
import { Loader } from 'lucide-react';
import EditTaskForm from './EditTaskForm';
import useGetTask from '@/app/hooks/tasks/useGetTask';

const EditTaskFormWrapper = ({ taskId }: { taskId: string }) => {
    const workspaceId = useWorkspaceId();
    const { data: projects, isLoading: isProjectsLoading } = useGetProjects({ workspaceId });
    const { data: members, isLoading: isMembersLoading } = useGetMembers({ workspaceId });
    const { data: initialValues, isPending: isTaskLoading } = useGetTask({ taskId });
    console.log(initialValues)
    const projectOptions = projects?.documents.map((project) => ({
        $id: project.$id,
        name: project.name,
        imageUrl: project.imageUrl
    }))

    const memberOptions = members?.documents.map((member) => ({
        $id: member.$id,
        name: member.name,
    }))

    const isLoading = isMembersLoading || isProjectsLoading || isTaskLoading;

    if (isLoading) {
        return (
            <Card className='w-full h-[700px] border-none shadow-none flex items-center justify-center'>
                <CardContent className='flex items-center justify-center h-full'>
                    <Loader className='size-5 animate-spin text-muted-foreground' />
                </CardContent>
            </Card>
        )
    }

    if (!initialValues) return null;

    return (
        <div>
            <EditTaskForm memberOptions={memberOptions ?? []} projectOptions={projectOptions ?? []} initialValues={initialValues} />
        </div>
    )
}

export default EditTaskFormWrapper