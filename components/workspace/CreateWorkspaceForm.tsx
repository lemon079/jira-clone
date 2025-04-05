"use client";
import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { z } from "zod";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createWorkspaceValidationSchema } from "@/lib/validation-schema/workspaces-validation-schema";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import useCreateWorkspace from "@/app/hooks/workspaces/useCreateWorkspace";
import { Avatar, AvatarFallback } from "../ui/avatar";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { MAX_FILE_SIZE } from "@/constants";
import useCreateWorkspaceModal from "@/app/hooks/workspaces/useCreateWorkspaceModal";

const CreateWorkspaceForm = ({ formType = "" }: { formType?: string }) => {

    const { mutate, isPending } = useCreateWorkspace();
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const { close } = useCreateWorkspaceModal();

    const form = useForm<z.infer<typeof createWorkspaceValidationSchema>>({
        resolver: zodResolver(createWorkspaceValidationSchema),
        defaultValues: {
            name: "",
        },
    });

    const handleSubmit = (
        values: z.infer<typeof createWorkspaceValidationSchema>
    ) => {
        const formData = {
            ...values,
            image: values.image instanceof File ? values.image : "" // sending "" as null since in our validation schema, we are treating "" as undefined/null
        }
        mutate({ form: formData }, {
            onSuccess: ({ data }) => {
                form.reset();
                if (formType === 'standalone') {
                    window.location.href = "/"
                }
                router.push(`/workspaces/${data.$id}`)
                close();
            }
        });
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
            form.clearErrors("image");
            form.setValue("image", file);
        }
    };


    return (
        <Card className="size-full border-none shadow-none">
            <CardHeader className="flex p-7">
                <CardTitle className="text-xl font-bold">
                    Create a new workspace
                </CardTitle>
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
                                        <FormLabel>Workspace Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                name="name"
                                                placeholder="Enter workspace name"
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
                                                    disabled={isPending}
                                                    onChange={handleImageChange}
                                                />
                                                <Button type="button" size={"sm"} className="w-fit mt-2" onClick={() => inputRef.current?.click()} disabled={isPending} variant={"teritrary"}>Upload Image</Button>
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
                                className={cn(formType === "standalone" && "invisible")}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending} size={"lg"}>
                                Create workspace
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>

    );
};

export default CreateWorkspaceForm;
