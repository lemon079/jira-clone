"use client"
import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Separator } from '../ui/separator'
import { z } from 'zod'
import { Input } from '../ui/input'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Button } from '../ui/button'
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { SignUpFormSchema } from '@/lib/validation-schema/auth-validation-schema'
import { useRegister } from '@/app/hooks/auth/useRegister'

const SignInCard = () => {

    const Google = FcGoogle as any;
    const Github = FaGithub as any;

    const { mutate, isPending } = useRegister();

    const form = useForm<z.infer<typeof SignUpFormSchema>>({
        resolver: zodResolver(SignUpFormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: ""
        }
    })

    const handleSubmit = (values: z.infer<typeof SignUpFormSchema>) => {
        mutate({ json: values });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className='text-2xl text-center font-bold mb-4'>Sign Up</CardTitle>
                <CardDescription className='text-xs text-center'>By signing up, you agree to our <Link href='#' className='text-blue-700'>Privacy Policy</Link>{" "} and <Link href='#' className='text-blue-700'>Terms and Conditions</Link></CardDescription>
            </CardHeader>
            <div className='px-7'>
                <Separator />
            </div>
            <CardContent>
                <Form {...form}>
                    <form className='space-y-4' onSubmit={form.handleSubmit(handleSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input type='text' disabled={isPending} {...field} name='name' placeholder='Enter Name' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input type='email' disabled={isPending} {...field} name='email' placeholder='Enter Email Address' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input type='password' disabled={isPending} {...field} name='password' placeholder='Enter Password' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button variant={'default'} size={'lg'} className='w-full bg-blue-700 text-white'>
                            Register
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default SignInCard

