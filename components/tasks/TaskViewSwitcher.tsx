"use client"
import React, { useCallback } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '../ui/button'
import { Loader, PlusIcon } from 'lucide-react'
import { Separator } from '../ui/separator'
import useGetTasks from '@/app/hooks/tasks/useGetTasks'
import useWorkspaceId from '@/app/hooks/workspaces/useWorkspaceId'
import { useQueryState } from 'nuqs'
import DataFilter from './DataFilter'
import { useTaskFilters } from '@/app/hooks/tasks/useTasksFilter'
import { DataTable } from './DataTable'
import { columns } from './Columns'
import useCreateTaskModal from '@/app/hooks/tasks/useCreateTaskModal'
import DataKanban from '../kanban/DataKanban'
import { TaskStatus } from '@/app/types'
import useBulkUpdateTask from '@/app/hooks/tasks/useBulkUpdateTask'
import DataCalender from './DataCalender'
import useProjectId from '@/app/hooks/projects/useProjectId'

const TaskViewSwitcher = ({ hideProjectFilter }: { hideProjectFilter?: boolean }) => {
    const workspaceId = useWorkspaceId();
    const paramProjectId = useProjectId();

    const [{ assigneeId, dueDate, projectId, status }] = useTaskFilters();
    const { open } = useCreateTaskModal();
    const { data: tasks, isLoading: isTasksLoading } = useGetTasks({ workspaceId, assigneeId, dueDate, projectId: paramProjectId || projectId, status })
    const { mutate: bulkUpdate, isPending: isBulkUpdating } = useBulkUpdateTask();

    const isLoading = isTasksLoading || isBulkUpdating;

    const [view, setView] = useQueryState('task-view', {
        defaultValue: 'table'
    })

    const onKanbanChange = useCallback((updatedTasks: { $id: string; status: TaskStatus; position: number }[]) => {
        bulkUpdate({
            json: {
                tasks: updatedTasks
            }
        })

    }, [])

    return (
        <Tabs className='rounded-lg border p-4' defaultValue={view} onValueChange={setView}>
            <div className='flex flex-col overflow-hidden'>
                <div className='flex flex-col lg:flex-row items-center gap-y-2 justify-between'>
                    <TabsList className='w-full lg:w-auto'>
                        <TabsTrigger className='h-8 w-full lg:w-auto' value='table'>Table</TabsTrigger>
                        <TabsTrigger className='h-8 w-full lg:w-auto' value='kanban'>Kanban</TabsTrigger>
                        <TabsTrigger className='h-8 w-full lg:w-auto' value='calender'>Calender</TabsTrigger>
                    </TabsList>
                    <Button size={"sm"} className='w-full lg:w-auto' onClick={() => open("SELECT")}><PlusIcon className='size-4 mr-2' />New</Button>
                </div>
            </div>
            <Separator className='my-4' />
            <DataFilter hideProjectFilter={hideProjectFilter} />
            <Separator className='my-4' />
            {isLoading ? (
                <div className='w-full border rounded-lg h-[200px] flex flex-col items-center justify-center'>
                    <Loader className='size-5 animate-spin' />
                </div>
            ) :
                <>
                    <TabsContent value='table' className='mt-0 flex flex-wrap w-full'>
                        <DataTable columns={columns} data={tasks?.documents ?? []} />
                    </TabsContent>
                    <TabsContent value='kanban' className='mt-0'>
                        <DataKanban data={tasks?.documents ?? []} onChange={onKanbanChange} />
                    </TabsContent>
                    <TabsContent value='calender' className='mt-0'>
                        <DataCalender data={tasks?.documents ?? []} />
                    </TabsContent>
                </>
            }

        </Tabs>
    )
}

export default TaskViewSwitcher