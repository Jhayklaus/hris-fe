import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from 'sonner'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Kọlá - HR Platform',
  description: 'Payroll-first HR platform for Nigerian SMEs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        <Providers>
          {children}
          <Toaster 
            position="top-right"
            expand={false}
            richColors
            closeButton
          />
        </Providers>
      </body>
    </html>
  )
}