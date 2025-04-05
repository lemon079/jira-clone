"use client";
import useDeleteProject from "@/app/hooks/projects/useDeleteProject";
import useEditProject from "@/app/hooks/projects/useEditProject";
import useGetProject from "@/app/hooks/projects/useGetProject";
import useProjectId from "@/app/hooks/projects/useProjectId";
import { useConfirm } from "@/app/hooks/useConfirm";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import PageError from "@/components/ui/page-error";
import PageLoader from "@/components/ui/page-loader";
import { Separator } from "@/components/ui/separator";
import { editProjectSchema } from "@/lib/validation-schema/projects-validation-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const EditProjectFormClient = () => {
    const projectId = useProjectId();
    const { data: project, isLoading } = useGetProject({ projectId });

    if (isLoading) return <PageLoader />

    if (!project) return <PageError message='Project Not Found' />

    const router = useRouter();
    const { mutate: editProject, isPending: isEditPending } = useEditProject();
    const { mutate: deleteProject, isPending: isDeletePending } = useDeleteProject();

    const isMutating = isDeletePending || isEditPending;

    const inputRef = useRef<HTMLInputElement>(null);

    const [DeleteDialogue, confirmDelete] = useConfirm(
        "Delete Project",
        "This action cannot be undone.",
        "destructive"
    );

    const handleDelete = async () => {
        const ok = await confirmDelete();
        if (!ok) return;

        deleteProject({
            param: {
                projectId: project.$id
            }
        }, {
            onSuccess: () => {
                window.location.href = "/"
            }
        });

    };

    const form = useForm<z.infer<typeof editProjectSchema>>({
        resolver: zodResolver(editProjectSchema),
        defaultValues: {
            ...project,
            image: project.imageUrl ?? ""
        },
    });

    const handleSubmit = (
        values: z.infer<typeof editProjectSchema>
    ) => {

        const formData = {
            ...values,
            image: values.image instanceof File ? values.image : "" // sending "" as null since in our validation schema, we are treating "" as undefined/null
        }

        editProject({ form: formData, param: { projectId: project.$id } }, {
            onSuccess: ({ data }) => {
                form.reset();
                router.push(`/workspaces/${data.workspaceId}/projects/${data.$id}`);
            }
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setValue("image", file)
        }
    }

    return (
        <div className="flex flex-col gap-y-4">
            <DeleteDialogue />
            <Card className="size-full border-none shadow-none">
                <CardHeader>
                    <div className="flex items-center gap-x-5">
                        <Button
                            variant="secondary"
                            onClick={() => router.push(`/workspaces/${project.workspaceId}/projects/${project.$id}`)}
                            disabled={isMutating}
                            className="w-fit"
                        >
                            <ArrowLeft className="size-5" />
                            Back
                        </Button>
                        <CardTitle className="text-xl font-bold">
                            {project.name}
                        </CardTitle>
                    </div>
                </CardHeader>
                <div className="px-7">
                    <Separator />
                </div>
                <CardContent className="p-7">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)}>
                            <div>
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
                                                    disabled={isMutating}
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
                                                    <p className="text-sm font-semibold">Workspace Icon</p>
                                                    <p className="text-xs text-muted-foreground font-semibold">
                                                        JPEG, JPG, PNG, SVG, max 1MB
                                                    </p>
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        ref={inputRef}
                                                        disabled={isMutating}
                                                        onChange={handleImageChange}
                                                    />
                                                    {field.value ? (
                                                        <Button
                                                            type="button"
                                                            size={"sm"}
                                                            className="w-fit mt-2 text-white"
                                                            onClick={() => {
                                                                field.onChange("");
                                                                if (inputRef.current) {
                                                                    inputRef.current.value = "";
                                                                }
                                                            }}
                                                            disabled={isMutating}
                                                            variant={"destructive"}
                                                        >
                                                            Remove Image
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            type="button"
                                                            size={"sm"}
                                                            className="w-fit mt-2"
                                                            onClick={() => inputRef.current?.click()}
                                                            disabled={isMutating}
                                                            variant={"teritrary"}
                                                        >
                                                            Upload Image
                                                        </Button>
                                                    )}

                                                </div>
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>
                            <div className="my-7">
                                <Separator />
                            </div>
                            <div className="w-full text-right">
                                <Button type="submit" disabled={isMutating} size={"lg"}>
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card >

            <Card className="size-full border-none shadow-none">
                <CardContent className="p-7">
                    <div className="flex flex-col">
                        <h3 className="font-bold">Danger Zone</h3>
                        <p>Deleting a project is irreversible and will remove all associated.</p>
                        <Separator className="my-5" />
                        <Button size={"sm"} variant={"destructive"} className="mt-6 w-fit ml-auto text-white" type="button" onClick={handleDelete}>
                            Delete Project
                        </Button>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
};

export default EditProjectFormClient;