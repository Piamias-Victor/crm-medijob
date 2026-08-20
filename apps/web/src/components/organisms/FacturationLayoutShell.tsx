'use client'

import { type ReactNode } from 'react'
import { Receipt } from 'lucide-react'
import { DashboardPage } from '@/components/molecules/DashboardPage'
import { FacturationNav } from '@/components/molecules/FacturationNav'

export function FacturationLayoutShell({ children }: { children: ReactNode }) {
  return (
    <DashboardPage
      icon={<Receipt className="size-5" />}
      title="Facturation"
      description="Stats globales et suivi des devis courants."
      nav={<FacturationNav />}
      maxWidth="max-w-6xl"
    >
      {children}
    </DashboardPage>
  )
}
