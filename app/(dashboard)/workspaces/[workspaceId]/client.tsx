"use client"

import useGetMembers from "@/app/hooks/members/useGetMembers";
import useCreateProjectModal from "@/app/hooks/projects/useCreateProjectModal";
import useGetProjects from "@/app/hooks/projects/useGetProjects";
import useCreateTaskModal from "@/app/hooks/tasks/useCreateTaskModal";
import useGetTasks from "@/app/hooks/tasks/useGetTasks";
import useGetWorkspaceAnalytics from "@/app/hooks/workspaces/useGetWorkspaceAnalytics";
import useWorkspaceId from "@/app/hooks/workspaces/useWorkspaceId"
import { Member, Project, Task } from "@/app/types";
import Analytics from "@/components/Analytics";
import MemberAvatar from "@/components/members/MemberAvatar";
import ProjectAvatar from "@/components/projects/ProjectAvatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PageError from "@/components/ui/page-error";
import PageLoader from "@/components/ui/page-loader";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import { CalendarIcon, PlusIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";

const WorkspaceIdClient = () => {
    const workspaceId = useWorkspaceId();
    const { data: analytics, isLoading: isWorkspaceAnalyticsLoading } = useGetWorkspaceAnalytics({ workspaceId });
    const { data: projects, isLoading: isProjectsLoading } = useGetProjects({ workspaceId });
    const { data: tasks, isLoading: isTasksLoading } = useGetTasks({ workspaceId });
    const { data: members, isLoading: isMembersLoading } = useGetMembers({ workspaceId });

    const isLoading = isWorkspaceAnalyticsLoading || isProjectsLoading || isTasksLoading || isMembersLoading;

    if (isLoading) return <PageLoader />

    if (!analytics || !projects || !tasks || !members) return <PageError message="Failed To Load Workspace Analytics" />

    return (
        <div className="h-full flex flex-col space-y-4">
            <Analytics data={analytics} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TaskList data={tasks.documents} total={tasks.total} />
                <ProjectList data={projects.documents} total={projects.total} />
                <MemberList data={members.documents} total={members.documents.length} />
            </div>
        </div>
    )
}

export default WorkspaceIdClient;


interface TaskListProps {
    data: Task[];
    total: number;
}

export const TaskList = ({ data, total }: TaskListProps) => {
    const { open: createTask } = useCreateTaskModal();
    const workspaceId = useWorkspaceId();

    return (
        <div className="flex flex-col gap-y-4 ">
            <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">Tasks ({total})</p>
                    <Button variant={"muted"} size={"icon"} onClick={() => createTask("new")}>
                        <PlusIcon className="size-4 text-neutral-400" />
                    </Button>
                </div>
                <Separator className="my-4" />
                <ul  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[278px] overflow-y-scroll">
                    {data.map((task) => (
                        <li key={task.$id}>
                            <Link href={`/workspaces/${workspaceId}/tasks/${task.$id}`}>
                                <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                                    <CardContent className="p-4">
                                        <p className="text-lg font-medium truncate">{task.name}</p>
                                        <div className="flex items-center gap-x-2">
                                            <p>{task.project?.name}</p>
                                            <div className="size-1 rounded-full bg-neutral-300" />
                                            <div className="text-sm text-muted-foreground flex items-center">
                                                <CalendarIcon className="size-3 mr-1" />
                                                <span className="truncate">
                                                    {formatDistanceToNow(new Date(task.dueDate))}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </li>
                    ))}
                    <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">No Tasks Found</li>
                </ul>
                <Button variant={"muted"} className="mt-4 w-full" asChild>
                    <Link href={`/workspaces/${workspaceId}/tasks`}>
                        Show All
                    </Link>
                </Button>
            </div>
        </div>
    )
}


interface ProjectListProps {
    data: Project[];
    total: number;
}

export const ProjectList = ({ data, total }: ProjectListProps) => {
    const { open: createProject } = useCreateProjectModal();

    const workspaceId = useWorkspaceId();

    return (
        <div className="flex flex-col gap-y-4 ">
            <div className="bg-white border rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">Projects ({total})</p>
                    <Button variant={"secondary"} size={"icon"} onClick={createProject}>
                        <PlusIcon className="size-4 text-neutral-400" />
                    </Button>
                </div>
                <Separator className="my-4" />
                <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {data.map((project) => (
                        <li key={project.$id}>
                            <Link href={`/workspaces/${workspaceId}/tasks/${project.$id}`}>
                                <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                                    <CardContent className="p-4 flex items-center gap-x-2.5">
                                        <ProjectAvatar name={project.name} image={project.imageUrl} className="size-12" fallBackClassName="text-lg" />
                                        <p className="text-lg font-medium truncate">{project.name}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        </li>
                    ))}
                    <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">No Tasks Found</li>
                </ul>
            </div>
        </div>
    )
}

interface MemberListProps {
    data: Member[];
    total: number;
}

export const MemberList = ({ data, total }: MemberListProps) => {
    const workspaceId = useWorkspaceId();

    return (
        <div className="flex flex-col gap-y-4 sm:col-span-2 ">
            <div className="bg-white border rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">Members ({total})</p>
                    <Button variant={"secondary"} size={"icon"} asChild>
                        <Link href={`/workspaces/${workspaceId}/members`}>
                            <SettingsIcon className="size-4 text-neutral-400" />
                        </Link>
                    </Button>
                </div>
                <Separator className="my-4" />
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.map((member) => (
                        <li key={member.$id}>
                            <Card className="shadow-none rounded-lg hover:opacity-75 transition max-w-xs">
                                <CardContent className="p-3 flex flex-col items-center gap-x-2">
                                    <MemberAvatar name={member.name} className="size-12" />
                                    <div className="flex flex-col items-center overflow-hidden">
                                        <p className="text-sm font-medium line-clamp-1">{member.name}</p>
                                        <p className="text-sm text-muted-foreground line-clamp-1">{member.email}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </li>
                    ))}
                    <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">No Members Found</li>
                </ul>
            </div>
        </div>
    )
}

