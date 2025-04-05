"use client"
import React from 'react'
import ResponsiveModal from '../ui/responsiveModel'
import CreateProjectForm from '@/components/projects/CreateProjectForm'
import useCreateProjectModal from '@/app/hooks/projects/useCreateProjectModal'

const CreateWorkspaceModal = () => {
    const {isOpen, setIsOpen} = useCreateProjectModal();

    return (
        <ResponsiveModal isOpen={isOpen} onOpenChange={setIsOpen}>
            <CreateProjectForm />
        </ResponsiveModal>
    )
}

export default CreateWorkspaceModal