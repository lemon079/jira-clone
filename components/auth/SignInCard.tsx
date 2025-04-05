"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Separator } from '../ui/separator'
import { z } from 'zod'
import { Input } from '../ui/input'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Button } from '../ui/button'
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { logInFormSchema } from '@/lib/validation-schema/auth-validation-schema'
import { useLogin } from '@/app/hooks/auth/useLogin'
import { signUpWithGithub, signUpWithGoogle } from "@/lib/server/oauth";


const SignInCard = () => {
    const Google = FcGoogle as any;
    const Github = FaGithub as any;

    const { mutate, isPending } = useLogin();

    const form = useForm<z.infer<typeof logInFormSchema>>({
        resolver: zodResolver(logInFormSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const handleSubmit = (values: z.infer<typeof logInFormSchema>) => {
        mutate({ json: values });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className='text-2xl text-center font-bold mb-4'>Welcome Back!</CardTitle>
            </CardHeader>
            <div className='px-7'>
                <Separator />
            </div>
            <CardContent>
                <Form {...form}>
                    <form className='space-y-4' onSubmit={form.handleSubmit(handleSubmit)}>
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
                            Login
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <div className='px-7'>
                <Separator />
            </div>
            <CardContent className='p-7 space-y-4'>
                <Button className='w-full' disabled={false} variant={'secondary'} size={'lg'} onClick={() => signUpWithGoogle()}><Google size={24} /> Login With Google</Button>
                <Button className='w-full' disabled={false} variant={'secondary'} size={'lg'} onClick={() => signUpWithGithub()}><Github size={24} /> Login With Github</Button>
            </CardContent>
        </Card >
    )
}

export default SignInCard