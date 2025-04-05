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
            <Providers>{children}</Providers>
        </NuqsAdapter>
      </body>
    </html>
  )
}