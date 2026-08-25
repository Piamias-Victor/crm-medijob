'use client'

import { SectionCard } from '@/components/molecules/SectionCard'
import { AppProfilesTable } from '@/components/molecules/AppProfilesTable'
import type { AppProfileListItem } from '@/view-models/app-profile-list'

type Props = { initialItems: AppProfileListItem[] }

export function AppProfilesSection({ initialItems }: Props) {
  return (
    <SectionCard
      variant="glass"
      title="Profils app"
      description="Nouveaux inscrits Badakan — l’invitation vidéo part automatiquement."
      bodyClassName="p-4 sm:p-5"
    >
      <AppProfilesTable items={initialItems} />
    </SectionCard>
  )
}
