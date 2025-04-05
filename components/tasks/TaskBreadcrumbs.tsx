import { Project, Task } from "@/app/types";
import React from "react";
import ProjectAvatar from "../projects/ProjectAvatar";
import Link from "next/link";
import useWorkspaceId from "@/app/hooks/workspaces/useWorkspaceId";
import { ChevronRight, TrashIcon } from "lucide-react";
import { Button } from "../ui/button";
import useDeleteTask from "@/app/hooks/tasks/useDeleteTask";
import { useConfirm } from "@/app/hooks/useConfirm";
import { useRouter } from "next/navigation";

interface TaskBreadcrumbsProps {
    project: Project;
    task: Task;
}

const TaskBreadcrumbs = ({ project, task }: TaskBreadcrumbsProps) => {
    const workspaceId = useWorkspaceId();
    const router = useRouter();
    const { mutate: deleteTask, isPending } = useDeleteTask();
    const [ConfirmDialogue, confirm] = useConfirm(
        "Delete Task",
        "This action cannot be undone",
        "destructive"
    );

    const handleDeleteTask = async () => {
        const ok = await confirm();
        if (!ok) return;

        deleteTask(
            { param: { taskId: task.$id } },
            {
                onSuccess: () => {
                    router.push(`/workspaces/${workspaceId}/tasks`);
                },
            }
        );
    };

    return (
        <div className="flex items-center gap-x-2">
            <ConfirmDialogue />
            <ProjectAvatar
                name={project.name}
                image={project.imageUrl}
                className="size-6 lg:size-8"
            />
            <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
                <p className="text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transition">
                    {project.name}
                </p>
            </Link>
            <ChevronRight className="size-4 lg:size-5 text-muted-foreground" />
            <p className="text-sm lg:text-lg font-semibold">{task.name}</p>
            <Button variant={"destructive"} size={"sm"} className="ml-auto" onClick={handleDeleteTask} disabled={isPending}>
                <TrashIcon />
                <span className="hidden lg:block">Delete Task</span>
            </Button>
        </div>
    );
};

export default TaskBreadcrumbs;
