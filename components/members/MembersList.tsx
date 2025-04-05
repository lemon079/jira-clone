"use client"
import React, { Fragment } from 'react'
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card'
import useWorkspaceId from '@/app/hooks/workspaces/useWorkspaceId'
import { Button } from '../ui/button'
import { ArrowLeftIcon, MoreVerticalIcon } from 'lucide-react'
import { Separator } from '../ui/separator'
import useGetMembers from '@/app/hooks/members/useGetMembers'
import Link from 'next/link'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import useDeleteMember from '@/app/hooks/members/useDeleteMember'
import useEditMember from '@/app/hooks/members/useEditMember'
import MemberAvatar from './MemberAvatar'
import { useConfirm } from '@/app/hooks/useConfirm'
import { Member, MemberRole } from '@/app/types'

const MembersList = () => {
    const workspaceId = useWorkspaceId();
    const { data } = useGetMembers({ workspaceId });
    const { mutate: deleteMember, isPending: isDeletingMember } = useDeleteMember();
    const { mutate: editMember, isPending: isUpdatingMember } = useEditMember();

    const isLoading = isDeletingMember || isUpdatingMember;

    const [DeleteDialogue, confirmDelete] = useConfirm(
        "Delete Member",
        "This action cannot be undone.",
        "destructive"
    );

    async function handleDelete(memberId: string) {
        const ok = await confirmDelete();
        if (!ok) return;

        deleteMember({
            param: { memberId }
        }, {
            onSuccess: () => {
                window.location.reload();
            }
        });
    }

    function handleUpdate(memberId: string, role: MemberRole) {
        editMember({
            param: { memberId },
            json: { role }
        });
    }


    return (
        <Card className='size-full border-none shadow-none'>
            <DeleteDialogue />
            <CardHeader className='flex flex-row items-center gap-x-4 p-7 space-y-0'>
                <Button asChild variant={"secondary"}>
                    <Link href={`/workspaces/${workspaceId}`}>
                        <ArrowLeftIcon className='size-4' />
                        Back
                    </Link>
                </Button>
                <CardTitle className='font-bold text-xl'>Members List</CardTitle>
            </CardHeader>
            <div className='px-7'>
                <Separator />
            </div>
            <CardContent className='p-7'>
                {data?.documents.map((member, index) => (
                    <Fragment key={member.$id}>
                        <div className='flex items-center gap-2 '>
                            <MemberAvatar name={member.name} className='size-10' />
                            <div className='flex flex-col'>
                                <p className='text-sm font-medium'>{member.name}</p>
                                <p className='text-sm text-muted-foreground'>{member.email}</p>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant={"secondary"} className='ml-auto' size={"icon"}>
                                        <MoreVerticalIcon className='text-muted-foreground size-4' />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem className='font-medium' onClick={() => handleUpdate(member.$id, MemberRole.ADMIN)} disabled={isLoading}>Set as Administrator</DropdownMenuItem>
                                    <DropdownMenuItem className='font-medium' onClick={() => handleUpdate(member.$id, MemberRole.MEMBER)} disabled={isLoading}>Set as Member</DropdownMenuItem>
                                    <DropdownMenuItem className='font-medium text-amber-700' onClick={() => handleDelete(member.$id)} disabled={isLoading}>Remove {member.name}</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        {index < data.documents.length - 1 && (
                            <Separator className={"my-2.5"} />
                        )}
                    </Fragment>
                ))}
            </CardContent>
        </Card >
    )
}

export default MembersList