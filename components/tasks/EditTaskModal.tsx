"use client"
import React from 'react'
import ResponsiveModal from '../ui/responsiveModel'
import useEditTaskModal from '@/app/hooks/tasks/useEditTaskModal'
import EditTaskFormWrapper from './EditTaskFormWrapper'

const EditTaskModal = () => {

    // we gonna open the edit task modal based on whether we receive the taskid or no
    const { taskId, close } = useEditTaskModal();

    return (
        <ResponsiveModal isOpen={!!taskId} onOpenChange={close}>
            {taskId && <EditTaskFormWrapper taskId={taskId} />}
        </ResponsiveModal>
    )
}

export default EditTaskModal