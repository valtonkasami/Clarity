import Image from 'next/image'
import './globals.css'
import type { Metadata } from 'next'
import { Providers } from '@/redux/providers'

import { Navbar, Login } from '@/components/index'

export const metadata: Metadata = {
  title: 'Clarity',
  description: 'Clarity is a Social Media Platform designed to improve Productivity!',
  icons: {
    icon: 'clarity.png'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className='bg-black'>
        <Providers>
          <Navbar/>
          <div className='pt-5'/>
          <div className='mt-[75px]'/>
        {children}
        </Providers>
      </body>
    </html>
  )
}
