"use client"
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

interface AuthChildrenNode {
    children: React.ReactNode
}

const layout = ({ children }: AuthChildrenNode) => {
    const pathname = usePathname();

    return (
        <main className='bg-neutral-100 min-h-screen'>
            <div className='mx-auto max-w-screen-2xl p-4'>
                <nav className='flex justify-between items-center'>
                    <Image src={"/logo.svg"} alt='logo' width={150} height={150} />

                    <Button asChild variant={"ghost"} size={"lg"} className='font-bold bg-gray-200' >
                        <Link href={pathname === "/sign-in" ? "sign-up" : "sign-in"}>{pathname === "/sign-in" ? "Sign Up" : "Sign In"}</Link>
                    </Button>

                </nav>
                <div className='flex justify-center items-center pt-4 md:pt-14'>
                    {children}
                </div>
            </div>
        </main>
    )
}

export default layout