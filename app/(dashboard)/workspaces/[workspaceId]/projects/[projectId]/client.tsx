"use client"
import useGetProject from '@/app/hooks/projects/useGetProject';
import useGetProjectAnalytics from '@/app/hooks/projects/useGetProjectAnalytics';
import useProjectId from '@/app/hooks/projects/useProjectId';
import ProjectAvatar from '@/components/projects/ProjectAvatar';
import Analytics from '@/components/Analytics';
import TaskViewSwitcher from '@/components/tasks/TaskViewSwitcher';
import { Button } from '@/components/ui/button';
import PageError from '@/components/ui/page-error';
import PageLoader from '@/components/ui/page-loader';
import { PencilIcon } from 'lucide-react';
import Link from 'next/link';

const ProjectIdClient = () => {
    const projectId = useProjectId();

    const { data: project, isLoading: isProjectLoading } = useGetProject({ projectId });
    const { data: analytics, isLoading: isAnalyticsLoading } = useGetProjectAnalytics({ projectId })

    const isLoading = isProjectLoading || isAnalyticsLoading;

    if (isLoading) return <PageLoader />

    if (!project) return <PageError message='Project Not Found' />

    return (
        <div className='flex flex-col gap-y-4'>
            <div className="flex items-center justify-between">
                <div className='flex gap-x-2 items-center'>
                    <ProjectAvatar name={project.name} image={project.imageUrl} className='size-8' />
                    <p>{project.name}</p>
                </div>
                <div>
                    <Button asChild variant={"secondary"}>
                        <Link href={`/workspaces/${project.workspaceId}/projects/${project.$id}/settings`}>
                            <PencilIcon className='mr-2 size-4' />Edit Project
                        </Link>
                    </Button>
                </div>
            </div>
            {analytics &&
                <Analytics data={analytics} />
            }
            <TaskViewSwitcher hideProjectFilter />
        </div>
    )
}

export default ProjectIdClient