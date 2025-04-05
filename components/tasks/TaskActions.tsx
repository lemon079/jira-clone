import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ExternalLinkIcon, PencilIcon } from 'lucide-react'
import useDeleteTask from '@/app/hooks/tasks/useDeleteTask'
import { useConfirm } from '@/app/hooks/useConfirm'
import { useRouter } from 'next/navigation'
import useWorkspaceId from '@/app/hooks/workspaces/useWorkspaceId'
import useEditTaskModal from '@/app/hooks/tasks/useEditTaskModal'

const TaskActions = ({ taskId, projectId, children }: { taskId: string, projectId: string, children: React.ReactNode }) => {

    const { mutate: deleteTask, isPending: isDeleteTask } = useDeleteTask();
    const { open } = useEditTaskModal();
    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const isLoading = isDeleteTask;

    const [DeleteDialogue, confirmDelete] = useConfirm(
        "Delete Task",
        "This action cannot be undone.",
        "destructive"
    );


    const handleDelete = async () => {
        const ok = await confirmDelete();
        if (!ok) return;

        deleteTask({
            param: {
                taskId: taskId
            }
        });

    };

    const handleOpenTask = () => {
        router.push(`/workspaces/${workspaceId}/tasks/${taskId}`)
    }

    const handleOpenProject = () => {
        router.push(`/workspaces/${workspaceId}/projects/${projectId}`)
    }

    return (
        <div className='flex justify-end'>
            <DeleteDialogue />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-48'>
                    <DropdownMenuItem onClick={handleOpenTask} disabled={isLoading} className='p-[10px] font-medium'>
                        <ExternalLinkIcon className='size-4 mr-2 stroke-2' />
                        Task Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleOpenProject} disabled={isLoading} className='p-[10px] font-medium'>
                        <ExternalLinkIcon className='size-4 mr-2 stroke-2' />
                        Open Project
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => open(taskId)} disabled={isLoading} className='p-[10px] font-medium'>
                        <PencilIcon className='size-4 mr-2 stroke-2' />
                        Edit Task
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete} disabled={isLoading} className='text-amber-700 focus:text-amber-700/80 p-[10px] font-medium'>
                        <ExternalLinkIcon className='size-4 mr-2 stroke-2' />
                        Delete Task
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div >
    )
}

export default TaskActions