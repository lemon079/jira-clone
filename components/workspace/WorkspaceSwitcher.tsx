"use client"
import useGetWorkspaces from '@/app/hooks/workspaces/useGetWorkspaces'
import React from 'react'
import { RiAddCircleFill } from "react-icons/ri";
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { SelectValue } from '@radix-ui/react-select'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { useRouter } from 'next/navigation'
import useWorkspaceId from '@/app/hooks/workspaces/useWorkspaceId'
import useCreateWorkspaceModal from '@/app/hooks/workspaces/useCreateWorkspaceModal'

interface WorkSpaceAvatarProps {
    name: string;
    image?: string;
    className?: string;
}

const WorkSpaceAvatar = ({ name, image, className }: WorkSpaceAvatarProps) => {


    if (image) {
        return (
            <div className={cn("size-10 relative rounded-md overflow-hidden", className)}>
                <Image src={image} alt='workspace-logo' fill className='object-cover' />
            </div>
        )
    } else {
        return (
            <div>
                <Avatar className={cn("size-10", className)}>
                    <AvatarFallback className='text-white bg-blue-600 font-semibold text-lg uppercase' >
                        {name[0]}
                    </AvatarFallback>
                </Avatar>
            </div>
        )
    }
}

const WorkspaceSwitcher = () => {

    const AddCircleFill = RiAddCircleFill as any;

    const { open } = useCreateWorkspaceModal();
    const { data: workspaces, isPending } = useGetWorkspaces();
    const router = useRouter();
    const workspaceId = useWorkspaceId(); // when page reload this gets us the current workspace id from params and set it to our Select Component Value

    function onSelect(workspaceId: string) {
        router.push(`/workspaces/${workspaceId}`)
    }

    return (
        <div className='flex flex-col gap-y-2'>
            <div className='flex items-center justify-between'>
                <p className='text-xs text-neutral-500 uppercase font-medium'>Workspaces</p>
                <AddCircleFill className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition" onClick={() => open()} />
            </div>
            <Select onValueChange={onSelect} disabled={isPending} value={workspaceId}>
                <SelectTrigger className='w-full bg-neutral-200 font-medium p-1 h-full'>
                    <SelectValue placeholder={workspaces?.total === 0 ? "no workspace created" : "select a workspace"} />
                </SelectTrigger>
                <SelectContent>
                    {workspaces?.documents?.map((workspace: any) => (
                        <SelectItem key={workspace.$id} value={workspace.$id}>
                            <div className="flex items-center gap-3 font-medium">
                                <WorkSpaceAvatar name={workspace.name} image={workspace.imageUrl} />
                                <span className='truncate'>{workspace.name}</span>
                            </div>
                        </SelectItem>

                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

export default WorkspaceSwitcher