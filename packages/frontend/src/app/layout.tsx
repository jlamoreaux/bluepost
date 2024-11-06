'use client';

import { SessionProvider } from 'next-auth/react';
import './globals.css'
import { Inter, Roboto } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const roboto = Roboto({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-roboto' })

// export const metadata = {
//   title: 'PostSync',
//   description: 'Seamlessly bridge your social presence',
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <SessionProvider>
        <body className={`${inter.variable} ${roboto.variable} font-sans`}>{children}</body>
      </SessionProvider>
    </html>
  )
}