import React from 'react'
import { TaskStatus } from '@/app/types'
import { snakeCaseToTitleCase } from '@/lib/utils';
import { CircleCheckIcon, CircleDashedIcon, CircleDotDashedIcon, CircleDotIcon, CircleIcon, PlusIcon } from 'lucide-react';
import { Button } from '../ui/button';
import useCreateTaskModal from '@/app/hooks/tasks/useCreateTaskModal';

interface KanbanColumnHeaderProps {
    board: TaskStatus;
    taskCount: number;
}

const statusIconMap: Record<TaskStatus, React.ReactNode> = {
    [TaskStatus.BACKLOG]: ( // will be "BACKLOG": { <CircleDashedIcon className='size-[18px] text-pink-400' /> }
        <CircleDashedIcon className='size-[18px] text-pink-400' />
    ),
    [TaskStatus.TODO]: (
        <CircleIcon className='size-[18px] text-red-400' />
    ),
    [TaskStatus.IN_PROGRESS]: (
        <CircleDotDashedIcon className='size-[18px] text-yellow-400' />
    ),
    [TaskStatus.IN_REVIEW]: (
        <CircleDotIcon className='size-[18px] text-blue-400' />
    ),
    [TaskStatus.DONE]: (
        <CircleCheckIcon className='size-[18px] text-emerald-400' />
    ),
}

const KanbanColumnHeader = ({ board, taskCount }: KanbanColumnHeaderProps) => {
    const { open } = useCreateTaskModal();
    const icon = statusIconMap[board]; // board is task status : "BACKLOG", "TODO", ... etc

    return (
        <div className='px-2 py-1.5 flex items-center justify-between'>
            <div className='flex items-center gap-x-2'>
                {icon}
                <h2 className='text-sm font-medium'>
                    {snakeCaseToTitleCase(board)}
                </h2>
                <div className='size-5 flex items-center justify-center rounded-md text-sm bg-neutral-200 text-neutral-700 font-medium'>
                    {taskCount}
                </div>
            </div>
            <Button onClick={() => open(board)} variant={"ghost"} size={'icon'} className='size-5'>
                <PlusIcon />
            </Button>
        </div>
    )
}

export default KanbanColumnHeader