import useGetMembers from '@/app/hooks/members/useGetMembers';
import useGetProjects from '@/app/hooks/projects/useGetProjects'
import useWorkspaceId from '@/app/hooks/workspaces/useWorkspaceId';
import React from 'react'
import { Card, CardContent } from '../ui/card';
import { Loader } from 'lucide-react';
import CreateTaskForm from './CreateTaskForm';

const CreateTaskFormWrapper = () => {
    const workspaceId = useWorkspaceId();

    const { data: projects, isLoading: isProjectsLoading } = useGetProjects({ workspaceId });
    const { data: members, isLoading: isMembersLoading } = useGetMembers({ workspaceId });

    const projectOptions = projects?.documents.map((project) => ({
        $id: project.$id,
        name: project.name,
        imageUrl: project.imageUrl
    }))

    const memberOptions = members?.documents.map((member) => ({
        $id: member.$id,
        name: member.name,
    }))

    const isLoading = isMembersLoading || isProjectsLoading;

    if (isLoading) {
        return (
            <>
                <Card className='w-full border-none shadow-none'>
                    <CardContent className='flex items-center justify-center h-full'>
                        <Loader className='size-5 animate-spin text-muted-foreground' />
                    </CardContent>
                </Card>
            </>
        )

    }


    return (
        <div>
            <CreateTaskForm memberOptions={memberOptions ?? []} projectOptions={projectOptions ?? []} />
        </div>
    )
}

export default CreateTaskFormWrapper