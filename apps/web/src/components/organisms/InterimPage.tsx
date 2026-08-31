'use client'

import { CalendarClock } from 'lucide-react'
import { EmptyState } from '@/components/atoms/EmptyState'
import { DashboardPage } from '@/components/molecules/DashboardPage'

export function InterimPage() {
  return (
    <DashboardPage
      icon={<CalendarClock className="size-5" />}
      title="Intérim"
      description="Vivier origine App et lectures Badakan — distinct de Facturation Intérim."
    >
      <EmptyState
        icon={CalendarClock}
        title="Module Intérim"
        description="Les listes (missions Badakan, contrats, filtre dispos) arriveront ici. La synchro suit le cycle Profils app."
      />
    </DashboardPage>
  )
}
