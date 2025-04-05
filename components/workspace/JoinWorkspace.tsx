"use client"
import React from 'react'
import { Card, CardContent, CardDescription, CardTitle, CardHeader } from "@/components/ui/card"
import { Button } from '../ui/button'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import useJoinWorkspace from '@/app/hooks/workspaces/useJoinWorkspace'
import { useRouter } from 'next/navigation'


interface JoinWorkspaceProps {
    initialValues: {
        name: string,
        $id: string,
        inviteCode: string
    }
}

const JoinWorkspace = ({ initialValues }: JoinWorkspaceProps) => {
    const { mutate, isPending } = useJoinWorkspace();
    const router = useRouter();

    function handleJoinWorkspace() {
        mutate({
            param: { workspaceId: initialValues.$id },
            json: { code: initialValues.inviteCode }
        },
            {
                onSuccess: ({ data }) => {
                    router.push(`/workspaces/${data.$id}`)
                }
            }
        )
    }

    return (
        <Card className="size-full border-none shadow-none">
            <CardHeader className='p-7'>
                <CardTitle className='font-bold text-xl'>
                    Join Workspace
                </CardTitle>
                <CardDescription>
                    You've been invited to join <strong>{initialValues.name}</strong> workspace
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className='p-3'>
                    <Separator />
                </div>
                <div className="flex flex-col lg:flex-row items-center justify-between mt-5">
                    <Button
                        size="lg"
                        type="button"
                        variant="secondary"
                        className='w-full lg:w-fit'
                        asChild
                        disabled={isPending}
                    >
                        <Link href={`/`}>
                            Cancel
                        </Link>
                    </Button>
                    <Button
                        size="lg"
                        type="button"
                        variant="default"
                        className='w-full lg:w-fit'
                        onClick={handleJoinWorkspace}
                        disabled={isPending}
                    >
                        Join Workspace
                    </Button>
                </div>
            </CardContent>
        </Card >
    )
}

export default JoinWorkspace