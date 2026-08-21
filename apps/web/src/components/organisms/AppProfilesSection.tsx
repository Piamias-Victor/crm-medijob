'use client'

import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { SectionCard } from '@/components/molecules/SectionCard'
import { AppProfilesTable } from '@/components/molecules/AppProfilesTable'
import { useAppProfileActions } from '@/lib/hooks/use-app-profile-actions'
import type { AppProfileListItem } from '@/view-models/app-profile-list'

type Props = { initialItems: AppProfileListItem[] }

export function AppProfilesSection({ initialItems }: Props) {
  const actions = useAppProfileActions(initialItems)

  return (
    <SectionCard
      variant="glass"
      title="Profils app"
      description="Nouveaux inscrits Badakan — ouvrez une fiche pour convertir ou lancer un entretien."
      bodyClassName="p-4 sm:p-5"
      actions={
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          disabled={actions.sync.isPending}
          onClick={() => actions.sync.mutate()}
        >
          <RefreshCw className={`size-4 ${actions.sync.isPending ? 'animate-spin' : ''}`} />
          Synchroniser
        </Button>
      }
    >
      <AppProfilesTable items={actions.items} />
    </SectionCard>
  )
}
