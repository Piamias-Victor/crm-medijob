'use client'

import { useState } from 'react'
import { SectionCard } from '@/components/molecules/SectionCard'
import { AppIntakeFollowUpTable } from '@/components/molecules/AppIntakeFollowUpTable'
import { AppIntakeReferentScopeToggle } from '@/components/molecules/AppIntakeReferentScopeToggle'
import { AppIntakePopulationToggle } from '@/components/molecules/AppIntakePopulationToggle'
import { trpc } from '@/lib/trpc/client'
import { interimCountLabel } from '@/view-models/interim-count-label'
import type { AppProfileListItem } from '@/view-models/app-profile-list'
import type { ListIntakeFollowUpInput } from '@/view-models/app-profile-intake-list.schema'

type Ref = { id: string; name: string }
type Props = { initialItems: AppProfileListItem[]; recruiters: readonly Ref[] }

export function AppIntakeFollowUpSection({ initialItems, recruiters }: Props) {
  const [scope, setScope] = useState<ListIntakeFollowUpInput['referentScope']>('mine')
  const [population, setPopulation] =
    useState<ListIntakeFollowUpInput['population']>('default')
  const useInitial = scope === 'mine' && population === 'default'
  const query = trpc.appProfile.listIntakeFollowUp.useQuery(
    { referentScope: scope, population },
    { initialData: useInitial ? initialItems : undefined },
  )
  const items = query.data ?? initialItems
  const description =
    population === 'archive'
      ? interimCountLabel(items.length, 'archive')
      : `${interimCountLabel(items.length, 'entrée')} à traiter`
  return (
    <SectionCard
      variant="glass"
      title="Entrées app"
      description={description}
      bodyClassName="space-y-4 p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-center gap-4">
        <AppIntakeReferentScopeToggle value={scope} onChange={setScope} />
        <AppIntakePopulationToggle value={population} onChange={setPopulation} />
      </div>
      <AppIntakeFollowUpTable items={items} recruiters={recruiters} />
    </SectionCard>
  )
}
