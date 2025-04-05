"use client"
import useGetWorkspaceInfo from '@/app/hooks/workspaces/useGetWorkspaceInfo'
import useWorkspaceId from '@/app/hooks/workspaces/useWorkspaceId'
import PageError from '@/components/ui/page-error'
import PageLoader from '@/components/ui/page-loader'
import JoinWorkspace from '@/components/workspace/JoinWorkspace'
import React from 'react'

const JoinWorkspaceClient = () => {
    const workspaceId = useWorkspaceId();

    const { data: initialValues, isLoading } = useGetWorkspaceInfo({ workspaceId })

    if (!initialValues) return <PageError message='Page Not Found' />

    if (isLoading) return <PageLoader />

    return (
        <div className='w-full lg:max-w-lg'>
            <JoinWorkspace initialValues={initialValues} />
        </div>
    )
}

export default JoinWorkspaceClient