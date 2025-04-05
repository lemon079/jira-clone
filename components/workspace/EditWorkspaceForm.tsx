"use client";
import React, { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { z } from "zod";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editWorkspaceValidationSchema } from "@/lib/validation-schema/workspaces-validation-schema";
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
import { ArrowLeft, CopyIcon, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "@/app/hooks/useConfirm";
import useDeleteWorkspace from "@/app/hooks/workspaces/useDeleteWorkspace";
import useResetInviteCode from "@/app/hooks/workspaces/useResetInviteCode";
import useEditWorkspace from "@/app/hooks/workspaces/useEditWorkspace";
import { Workspace } from "@/app/types";

const EditWorkspaceForm = ({ initialValues }: { initialValues: Workspace }) => {

    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const { mutate: deleteWorkspace, isPending: isDeletePending } = useDeleteWorkspace();
    const { mutate: editWorkspace, isPending: isEditPending } = useEditWorkspace();
    const { mutate: resetInviteCode, isPending: isResetPending } = useResetInviteCode();

    const [DeleteDialogue, confirmDelete] = useConfirm(
        "Delete Workspace",
        "This action cannot be undone.",
        "destructive"
    );
    const [ResetInviteDialogue, confirmResetInvite] = useConfirm(
        "Reset Invite Link",
        "This will reset the current invite link.",
        "destructive"
    );

    const isMutating = isResetPending || isDeletePending || isEditPending;

    const handleDelete = async () => {
        const ok = await confirmDelete();
        if (!ok) return;
        deleteWorkspace({
            param: {
                workspaceId: initialValues.$id
            }
        }, {
            onSuccess: () => {
                window.location.href = "/"
            }
        });
    };

    const handleResetInviteLink = async () => {
        const ok = await confirmResetInvite();
        if (!ok) return;
        resetInviteCode({
            param: {
                workspaceId: initialValues.$id
            }
        });

    };

    const form = useForm<z.infer<typeof editWorkspaceValidationSchema>>({
        resolver: zodResolver(editWorkspaceValidationSchema),
        defaultValues: {
            ...initialValues,
            image: initialValues.imageUrl ?? "",
        },
    });

    const handleSubmit = (
        values: z.infer<typeof editWorkspaceValidationSchema>
    ) => {
        const formData = {
            ...values,
            image: values.image instanceof File ? values.image : "",
        };

        editWorkspace(
            { form: formData, param: { workspaceId: initialValues.$id } },
            {
                onSuccess: ({ data }) => {
                    form.reset();
                    router.push(`/workspaces/${data.$id}`);
                },
            }
        );
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setValue("image", file);
        }
    };

    //fullLink example := URL/workspaces/workspaceId/join/workspaceInviteCode
    const fullInviteLinkCode = `${window?.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`;

    const handleInviteCode = () => {
        navigator.clipboard
            .writeText(fullInviteLinkCode)
            .then(() => toast.success("Copied to Clipboard"));
    };

    return (
        <div className="flex flex-col gap-y-4">
            <DeleteDialogue />
            <ResetInviteDialogue />
            <Card className="size-full border-none shadow-none">
                <CardHeader>
                    <div className="flex items-center gap-x-5">
                        <Button
                            variant="secondary"
                            onClick={() => router.back()}
                            disabled={isMutating}
                            className="w-fit"
                        >
                            <ArrowLeft className="size-5" />
                            Back
                        </Button>
                        <CardTitle className="text-xl font-bold">
                            {initialValues.name}
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
                                            <FormLabel>Workspace Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    name="name"
                                                    placeholder="Enter workspace name"
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
                                                    <p className="text-sm font-semibold">
                                                        Workspace Icon
                                                    </p>
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
                                                                field.onChange(""); // Set to empty string instead of null
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
            </Card>
            <Card className="size-full border-none shadow-none">
                <CardContent className="p-7">
                    <div className="flex flex-col">
                        <h3 className="font-bold">Invite Members</h3>
                        <p>Use the link below to invite Members to your Workspace.</p>
                        <div className="flex flex-col justify-between mt-4">
                            <div className="flex items-center gap-x-2">
                                <input
                                    disabled
                                    type="text"
                                    value={fullInviteLinkCode}
                                    className="w-full text-neutral-400"
                                />
                                <Button
                                    variant={"secondary"}
                                    size={"icon"}
                                    onClick={handleInviteCode}
                                >
                                    <CopyIcon className="size-5" />
                                </Button>
                            </div>
                            <Separator className="my-5" />
                            <Button
                                size={"sm"}
                                variant={"destructive"}
                                className="mt-6 w-fit ml-auto text-white"
                                type="button"
                                disabled={isMutating}
                                onClick={handleResetInviteLink}
                            >
                                Reset Invite Link
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="size-full border-none shadow-none">
                <CardContent className="p-7">
                    <div className="flex flex-col">
                        <h3 className="font-bold">Danger Zone</h3>
                        <p>
                            Deleting a workspace is irreversible and will remove all
                            associated.
                        </p>
                        <Separator className="my-5" />
                        <Button
                            size={"sm"}
                            variant={"destructive"}
                            className="mt-6 w-fit ml-auto text-white"
                            type="button"
                            onClick={handleDelete}
                            disabled={isMutating}
                        >
                            Delete Workspace
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default EditWorkspaceForm;
