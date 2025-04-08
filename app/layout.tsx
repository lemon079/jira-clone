import type { Metadata } from 'next'
import Providers from './provider'
import "./globals.css"
import { Toaster } from '@/components/ui/sonner'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export const metadata: Metadata = {
  title: 'Jira',
  description: 'Project Management Tool'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster />
        <NuqsAdapter>
          <Providers>
            <a href="/design.PNG" target='_blank' className='absolute bottom-5 left-3 text-white opacity-75 transition hover:opacity-100 text-sm text-center bg-black p-2 rounded-md'>Project Details</a>
            {children}
          </Providers>
        </NuqsAdapter>
      </body>
    </html>
  )
}