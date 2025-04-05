"use client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { z } from "zod";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import useWorkspaceId from "@/app/hooks/workspaces/useWorkspaceId";
import { createTaskFormSchema } from "@/lib/validation-schema/tasks-validation-schema";
import { DatePicker } from "../DatePicker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import MemberAvatar from "../members/MemberAvatar";
import ProjectAvatar from "../projects/ProjectAvatar";
import { Task } from "@/app/types";
import useEditTask from "@/app/hooks/tasks/useEditTask";
import useEditTaskModal from "@/app/hooks/tasks/useEditTaskModal";

interface EditTaskFormProps {
    projectOptions: {
        $id: string;
        name: string;
        imageUrl: string;
    }[];
    memberOptions: {
        $id: string,
        name: string,
    }[];
    initialValues: Task;
}

const editTaskForm = createTaskFormSchema.omit({ workspaceId: true, description: true });

const EditTaskForm = ({ projectOptions, memberOptions, initialValues }: EditTaskFormProps) => {
    const { mutate, isPending } = useEditTask();
    const { close } = useEditTaskModal();

    const form = useForm<z.infer<typeof editTaskForm>>({
        resolver: zodResolver(editTaskForm),
        defaultValues: {
            ...initialValues,
            dueDate: initialValues.dueDate ? new Date(initialValues.dueDate) : undefined
        },
    });

    const handleSubmit = (values: z.infer<typeof editTaskForm>) => {
        mutate(
            { json: values, param: { taskId: initialValues.$id } }, {
            onSuccess: () => {
                form.reset();
                close();
            },
        }
        );
    };

    return (
        <Card className="size-full border-none shadow-none">
            <CardHeader className="flex p-7">
                <CardTitle className="text-xl font-bold">
                    Edit a Task
                </CardTitle>
            </CardHeader>
            <div className="px-7">
                <Separator />
            </div>
            <CardContent className="p-7">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <div className="flex flex-col gap-y-2 lg:gap-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Task Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                name="name"
                                                placeholder="Enter task name"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="dueDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Due Date</FormLabel>
                                        <FormControl>
                                            <DatePicker value={field.value} onChange={field.onChange} placeholder="Select a Date" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="assigneeId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Assignee</FormLabel>
                                        <Select defaultValue={field.value} onValueChange={field.onChange}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Assignee" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent >
                                                {memberOptions.map((member) => (
                                                    <SelectItem key={member.$id} value={member.$id}>
                                                        <div className="flex items-center gap-x-2">
                                                            <MemberAvatar name={member.name} className="size-6" />
                                                            {member.name}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select defaultValue={field.value} onValueChange={field.onChange}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="BACKLOG">Backlog</SelectItem>
                                                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                                <SelectItem value="IN_REVIEW">In Review</SelectItem>
                                                <SelectItem value="TODO">Todo</SelectItem>
                                                <SelectItem value="DONE">Done</SelectItem>
                                            </SelectContent>

                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="projectId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Project Assigned</FormLabel>
                                        <Select defaultValue={field.value} onValueChange={field.onChange}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Project" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent >
                                                {projectOptions.map((project) => (
                                                    <SelectItem key={project.$id} value={project.$id}>
                                                        <div className="flex items-center gap-x-2">
                                                            <ProjectAvatar name={project.name} className="size-6" />
                                                            {project.name}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="my-7">
                            <Separator />
                        </div>
                        <div className="flex items-center justify-between">
                            <Button
                                type="button"
                                disabled={isPending}
                                size={"lg"}
                                variant={"secondary"}
                                onClick={() => close()}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending} size={"lg"}>
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card >
    );
};

export default EditTaskForm;
