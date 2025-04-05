"use client"
import React from 'react'
import ResponsiveModal from '../ui/responsiveModel'
import CreateTaskFormWrapper from './CreateTaskFormWrapper'
import useCreateTaskModal from '@/app/hooks/tasks/useCreateTaskModal'

const CreateTaskModal = () => {
    const { isOpen, setIsOpen } = useCreateTaskModal();

    return (
        <ResponsiveModal isOpen={!!isOpen} onOpenChange={(open) => setIsOpen(open ? "open" : "")}>
            <CreateTaskFormWrapper />
        </ResponsiveModal>
    )
}

export default CreateTaskModal