"use client"
import React from 'react'
import useGetProjects from '@/app/hooks/projects/useGetProjects'
import useWorkspaceId from '@/app/hooks/workspaces/useWorkspaceId'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { RiAddCircleFill } from 'react-icons/ri'
import ProjectAvatar from './ProjectAvatar'
import useCreateProjectModal from '@/app/hooks/projects/useCreateProjectModal'

const ProjectSwitcher = () => {
    const AddCircleFill = RiAddCircleFill as any;

    const { open } = useCreateProjectModal();
    const workspaceId = useWorkspaceId();
    const { data: projects } = useGetProjects({ workspaceId });
    const pathname = usePathname();

    return (
        <div className='flex flex-col '>
            <div className='flex items-center justify-between'>
                <p className='text-xs text-neutral-500 uppercase font-medium'>Projects</p>
                <AddCircleFill className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition" onClick={() => open()} />
            </div>
            {projects?.documents.map((project) => {
                const href = `/workspaces/${workspaceId}/projects/${project.$id}`;
                const isActive = pathname === href
                return (
                    <Link href={href}>
                        <div className={cn("flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500", isActive && "bg-white shadow-sm hover:opacity-100 text-primary")} >
                            <ProjectAvatar name={project.name} image={project.imageUrl} />
                            <span className='truncate'>{project.name}</span>
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}

export default ProjectSwitcher