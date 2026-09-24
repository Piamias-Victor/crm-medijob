'use client'

import { SectionCard } from '@/components/molecules/SectionCard'
import { AppIntakeFollowUpTable } from '@/components/molecules/AppIntakeFollowUpTable'
import { interimCountLabel } from '@/view-models/interim-count-label'
import type { AppProfileListItem } from '@/view-models/app-profile-list'

type Props = { initialItems: AppProfileListItem[] }

export function AppIntakeFollowUpSection({ initialItems }: Props) {
  return (
    <SectionCard
      variant="glass"
      title="Entrées app"
      description={`${interimCountLabel(initialItems.length, 'entrée')} à traiter`}
      bodyClassName="space-y-4 p-4 sm:p-5"
    >
      <AppIntakeFollowUpTable items={initialItems} />
    </SectionCard>
  )
}
