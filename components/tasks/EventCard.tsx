import { Member, Project, TaskStatus } from '@/app/types';
import { cn } from '@/lib/utils';
import React from 'react'
import MemberAvatar from '../members/MemberAvatar';
import ProjectAvatar from '../projects/ProjectAvatar';
import useWorkspaceId from '@/app/hooks/workspaces/useWorkspaceId';
import { useRouter } from 'next/navigation';

interface EventCardProps {
    id: string;
    title: string;
    assignee: Member;
    project: Project;
    status: TaskStatus;
}

const statusColor = {
    [TaskStatus.BACKLOG]: "border-l-pink-500",
    [TaskStatus.IN_PROGRESS]: "border-l-yellow-500",
    [TaskStatus.TODO]: "border-l-red-500",
    [TaskStatus.IN_REVIEW]: "border-l-pink-500",
    [TaskStatus.DONE]: "border-l-emrald-500",
}

const EventCard = ({ assignee, id, project, status, title }: EventCardProps) => {

    const workspaceId = useWorkspaceId();
    const router = useRouter();

    function handleClick(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        router.push(`/workspaces/${workspaceId}/tasks/${id}`);
    }

    return (
        <div className='px-2'>
            <div onClick={handleClick} className={cn("p-1.5 text-xs bg-white text-primary rounded-md border-l-4 flex flex-col gap-y-1.5 cursor-pointer hover:opacity-75 transition", statusColor[status])}>
                <p>{title}</p>
                <div className='flex items-center gap-x-1'>
                    <MemberAvatar name={assignee?.name} />
                    <div className='size-1 rounded-full bg-neutral-300' />
                    <ProjectAvatar name={project?.name} image={project?.imageUrl} />
                </div>
            </div>
        </div>
    )
}

export default EventCard