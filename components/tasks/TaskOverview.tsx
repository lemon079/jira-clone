import { Task } from '@/app/types'
import React from 'react'
import { Button } from '../ui/button'
import { PencilIcon } from 'lucide-react'
import { Separator } from '../ui/separator'
import TaskOverviewProperty from './TaskOverviewProperty'
import MemberAvatar from '../members/MemberAvatar'
import { TaskDate } from './TaskDate'
import { snakeCaseToTitleCase } from '@/lib/utils'
import { Badge } from '../ui/badge'
import useEditTaskModal from '@/app/hooks/tasks/useEditTaskModal'

const TaskOverview = ({ task }: { task: Task }) => {
    const { open } = useEditTaskModal();

    return (
        <div className='flex flex-col gap-y-4 col-span-1 '>
            <div className='bg-muted rounded-lg p-4'>
                <div className='flex items-center justify-between w-full'>
                    <p className='text-lg font-semibold'>Overview</p>
                    <Button onClick={() => open(task.$id)} size={"sm"} variant={"secondary"}>
                        <PencilIcon className='size-4 mr-2' />
                        Edit
                    </Button>
                </div>
                <Separator className='my-4' />
                <div className='flex flex-col gap-y-4'>
                    <TaskOverviewProperty label='Assignee'>
                        <MemberAvatar name={task.assignee.name} className='size-6' />
                        <p>{task.assignee.name}</p>
                    </TaskOverviewProperty>
                    <TaskOverviewProperty label='Due Date'>
                        <TaskDate value={task.dueDate} className='text-sm font-medium' />
                    </TaskOverviewProperty>
                    <TaskOverviewProperty label='Status'>
                        <Badge variant={task.status}>
                            {snakeCaseToTitleCase(task.status)}
                        </Badge>
                    </TaskOverviewProperty>
                </div>
            </div>
        </div>
    )
}

export default TaskOverview