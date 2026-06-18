'use client'

import { type ReactNode } from 'react'
import { Settings2 } from 'lucide-react'
import { DashboardPage } from '@/components/molecules/DashboardPage'
import { AdminNav } from '@/components/molecules/AdminNav'

export function AdminLayoutShell({ children }: { children: ReactNode }) {
  return (
    <DashboardPage
      icon={<Settings2 className="size-5" />}
      title="Administration"
      description="Référentiels MediJob — pipeline, logiciels, groupements, métiers, utilisateurs."
      nav={<AdminNav />}
      maxWidth="max-w-5xl"
    >
      {children}
    </DashboardPage>
  )
}
