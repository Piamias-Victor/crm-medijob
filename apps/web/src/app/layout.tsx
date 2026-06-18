import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { TrpcProvider } from '@/components/providers/TrpcProvider'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'CRM Medijob',
  description: 'CRM interne — recrutement pharmacie',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body>
        <TrpcProvider>{children}</TrpcProvider>
      </body>
    </html>
  )
}
