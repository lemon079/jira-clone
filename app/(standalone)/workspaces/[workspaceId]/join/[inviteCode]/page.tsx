import { getCurrentUser } from '@/lib/server/auth/queries'
import { redirect } from 'next/navigation';
import React from 'react'
import JoinWorkspaceClient from './client';

const page = async () => {

  const user = await getCurrentUser();

  if (!user) redirect("/sign-in")

  return <JoinWorkspaceClient />

}

export default page