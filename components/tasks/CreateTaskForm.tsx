"use client";
import { useContext } from "react";
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
import useCreateTask from "@/app/hooks/tasks/useCreateTask";
import { createTaskFormSchema } from "@/lib/validation-schema/tasks-validation-schema";
import { DatePicker } from "../DatePicker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import MemberAvatar from "../members/MemberAvatar";
import ProjectAvatar from "../projects/ProjectAvatar";
import useCreateTaskModal from "@/app/hooks/tasks/useCreateTaskModal";
import { TaskStatus } from "@/app/types";

interface CreateTaskFormProps {
    projectOptions: {
        $id: string;
        name: string;
        imageUrl: string;
    }[];
    memberOptions: {
        $id: string,
        name: string,
    }[];
}

const CreateTaskForm = ({ projectOptions, memberOptions }: CreateTaskFormProps) => {
    const workspaceId = useWorkspaceId();
    const { close, isOpen } = useCreateTaskModal();
    const { mutate, isPending } = useCreateTask();

    const form = useForm<z.infer<typeof createTaskFormSchema>>({
        resolver: zodResolver(createTaskFormSchema),
        defaultValues: {
            workspaceId,
            status: isOpen as TaskStatus
        },
    });

    const handleSubmit = (values: z.infer<typeof createTaskFormSchema>) => {
        mutate(
            { json: { ...values, workspaceId } }, {
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
                    Create a new Task
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
                                            <DatePicker className="ml-5" value={field.value} onChange={field.onChange} placeholder="Select a Date" />
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
                                Create Task
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card >
    );
};

export default CreateTaskForm;
