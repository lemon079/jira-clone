import { Task } from "@/app/types";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { PencilIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import useEditTask from "@/app/hooks/tasks/useEditTask";
import { cn } from "@/lib/utils";

interface TaskDescriptionProps {
    task: Task;
}

const TaskDescription = ({ task }: TaskDescriptionProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(task.description);
    const { mutate, isPending } = useEditTask();

    const handleSave = () => {
        mutate({ json: { description: value }, param: { taskId: task.$id } }, { onSuccess: () => setIsEditing(prev => !prev) });
    };

    return (
        <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between w-full">
                <p className="text-lg font-semibold">Overview</p>
                <Button onClick={() => setIsEditing(prev => !prev)} size={"sm"} variant={"secondary"}>

                    <PencilIcon className="size-4 mr-2" />
                    {isEditing ? "Cancel" : "Edit"}
                </Button>
            </div>
            <Separator className="my-4" />
            <div className="flex flex-col gap-y-4">
                <span className={cn(isEditing && "hidden", task.description ? "text-foreground" : "text-muted-foreground")}>{task.description || "No Description Set"}</span>
                {isEditing && (
                    <>
                        <textarea
                            className="resize-none border border-black rounded-md p-2 text-sm"
                            placeholder="Enter Description"
                            rows={4}
                            onChange={(e) => setValue(e.target.value)}
                            value={task.description ?? ""}
                            disabled={isPending}
                        />
                        <Button variant="default" className="w-fit ml-auto" onClick={handleSave} disabled={isPending}>
                            Save Changes
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default TaskDescription;
