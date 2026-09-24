'use client'

import { useState } from 'react'
import { SectionCard } from '@/components/molecules/SectionCard'
import { AppIntakeFollowUpTable } from '@/components/molecules/AppIntakeFollowUpTable'
import { AppIntakeReferentScopeToggle } from '@/components/molecules/AppIntakeReferentScopeToggle'
import { trpc } from '@/lib/trpc/client'
import { interimCountLabel } from '@/view-models/interim-count-label'
import type { AppProfileListItem } from '@/view-models/app-profile-list'
import type { ListIntakeFollowUpInput } from '@/view-models/app-profile-intake-list.schema'

type Ref = { id: string; name: string }
type Props = { initialItems: AppProfileListItem[]; recruiters: readonly Ref[] }

export function AppIntakeFollowUpSection({ initialItems, recruiters }: Props) {
  const [scope, setScope] = useState<ListIntakeFollowUpInput['referentScope']>('mine')
  const query = trpc.appProfile.listIntakeFollowUp.useQuery(
    { referentScope: scope },
    { initialData: scope === 'mine' ? initialItems : undefined },
  )
  const items = query.data ?? initialItems
  return (
    <SectionCard
      variant="glass"
      title="Entrées app"
      description={`${interimCountLabel(items.length, 'entrée')} à traiter`}
      bodyClassName="space-y-4 p-4 sm:p-5"
    >
      <AppIntakeReferentScopeToggle value={scope} onChange={setScope} />
      <AppIntakeFollowUpTable items={items} recruiters={recruiters} />
    </SectionCard>
  )
}
