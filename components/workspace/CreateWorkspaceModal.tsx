"use client"
import React from 'react'
import ResponsiveModal from '../ui/responsiveModel'
import CreateWorkspaceForm from '@/components/workspace/CreateWorkspaceForm'
import useCreateWorkspaceModal from '@/app/hooks/workspaces/useCreateWorkspaceModal'

const CreateWorkspaceModal = () => {
    const { isOpen, setIsOpen } = useCreateWorkspaceModal();

    return (
        <ResponsiveModal isOpen={isOpen} onOpenChange={setIsOpen}>
            <CreateWorkspaceForm />
        </ResponsiveModal>
    )
}

export default CreateWorkspaceModal