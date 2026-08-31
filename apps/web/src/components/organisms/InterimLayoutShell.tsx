'use client'

import { type ReactNode } from 'react'
import { CalendarClock } from 'lucide-react'
import { DashboardPage } from '@/components/molecules/DashboardPage'
import { InterimNav } from '@/components/molecules/InterimNav'

export function InterimLayoutShell({ children }: { children: ReactNode }) {
  return (
    <DashboardPage
      icon={<CalendarClock className="size-5" />}
      title="Intérim"
      description="Missions Badakan, distinctes du kanban Missions et de Facturation Intérim."
      nav={<InterimNav />}
      maxWidth="max-w-6xl"
    >
      {children}
    </DashboardPage>
  )
}
