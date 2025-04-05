"use client";
import { useRef } from "react";
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
import { Avatar, AvatarFallback } from "../ui/avatar";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import useWorkspaceId from "@/app/hooks/workspaces/useWorkspaceId";
import { createProjectSchema } from "@/lib/validation-schema/projects-validation-schema";
import useCreateProject from "@/app/hooks/projects/useCreateProject";
import { MAX_FILE_SIZE } from "@/constants";
import { useRouter } from "next/navigation";
import useCreateProjectModal from "@/app/hooks/projects/useCreateProjectModal";

// Extract a schema for the form that omits workspaceId
const projectFormSchema = createProjectSchema.omit({ workspaceId: true });

const CreateWorkspaceForm = () => {
    const { close } = useCreateProjectModal();
    const { mutate, isPending } = useCreateProject();
    const inputRef = useRef<HTMLInputElement>(null);
    const workspaceId = useWorkspaceId();

    const form = useForm<z.infer<typeof projectFormSchema>>({
        resolver: zodResolver(projectFormSchema),
        defaultValues: {
            name: "",
        },
    });

    const router = useRouter();

    const handleSubmit = (values: z.infer<typeof projectFormSchema>) => {
        const formData = {
            ...values,
            workspaceId,
            image: values.image instanceof File ? values.image : "",
        };

        mutate(
            { form: formData }, {
            onSuccess: ({ data }) => {
                form.reset();
                close();
                router.push(`/workspaces/${workspaceId}/projects/${data.$id}`)
            },
        }
        );
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                form.setError("image", {
                    type: "manual",
                    message: "File is too big. Maximum allowed size is 1.4 MB.",
                });
                return;
            }
            // Clear any previous error for the image field
            form.clearErrors("image");
            form.setValue("image", file);
        }
    };

    return (
        <Card className="size-full border-none shadow-none">
            <CardHeader className="flex p-7">
                <CardTitle className="text-xl font-bold">
                    Create a new project
                </CardTitle>
            </CardHeader>
            <div className="px-7">
                <Separator />
            </div>
            <CardContent className="p-7">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <div className="flex flex-col gap-y-2 lg:gap-y-7">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Project Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                name="name"
                                                placeholder="Enter project name"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <div className="flex flex-col mt-5">
                                        <div className="flex items-center gap-x-5">
                                            {field.value ? (
                                                <div className="size-[72px] relative rounded-md overflow-hidden">
                                                    <Image
                                                        src={
                                                            field.value instanceof File
                                                                ? URL.createObjectURL(field.value)
                                                                : field.value
                                                        }
                                                        width={72}
                                                        height={72}
                                                        alt="logo"
                                                        className="rounded-full size-[72px] object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <Avatar className="size-[72px] mt-3">
                                                    <AvatarFallback>
                                                        <ImageIcon className="size-[36px] text-neutral-400" />
                                                    </AvatarFallback>
                                                </Avatar>
                                            )}
                                            <div className="flex flex-col">
                                                <p className="text-sm font-semibold">Project Icon</p>
                                                <p className="text-xs text-muted-foreground font-semibold">
                                                    JPEG, JPG, PNG, SVG, max 1MB
                                                </p>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    ref={inputRef}
                                                    disabled={isPending}
                                                    onChange={handleImageChange}
                                                />
                                                <Button
                                                    type="button"
                                                    size={"sm"}
                                                    className="w-fit mt-2"
                                                    onClick={() => inputRef.current?.click()}
                                                    disabled={isPending}
                                                    variant={"teritrary"}
                                                >
                                                    Upload Image
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
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
                                Create project
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default CreateWorkspaceForm;
