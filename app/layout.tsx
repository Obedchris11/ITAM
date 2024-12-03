'use client'

import './globals.css'
import { ReactNode } from 'react'
import ClientLayout from './ClientLayout'
import { usePathname } from 'next/navigation'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </body>
    </html>
  )
}

function ClientLayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  if (pathname === '/' || pathname === '/login' || pathname === '/Profil-User') {
    return <>{children}</>
  }

  return <ClientLayout>{children}</ClientLayout>
}