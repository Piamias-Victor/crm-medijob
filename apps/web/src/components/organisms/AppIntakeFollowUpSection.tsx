'use client'

import { useMemo } from 'react'
import { SectionCard } from '@/components/molecules/SectionCard'
import { AppIntakeFollowUpTable } from '@/components/molecules/AppIntakeFollowUpTable'
import { AppIntakeFilterBar } from '@/components/molecules/AppIntakeFilterBar'
import { AppIntakeListKeyProvider } from '@/lib/hooks/use-app-intake-list-key'
import { useEntityFilters } from '@/hooks/use-entity-filters'
import { buildAppIntakeFilterConfig } from '@/lib/filters/app-intake-filter-config'
import {
  buildAppIntakeFilterDefaults,
  intakeListKeyFromFilters,
} from '@/lib/filters/app-intake-filter-utils'
import { filterAppIntakeRows } from '@/view-models/filter-app-intake-rows'
import { trpc } from '@/lib/trpc/client'
import { interimCountLabel } from '@/view-models/interim-count-label'
import type { AppProfileListItem } from '@/view-models/app-profile-list'

type Ref = { id: string; name: string }
type Props = { initialItems: AppProfileListItem[]; recruiters: readonly Ref[] }

export function AppIntakeFollowUpSection({ initialItems, recruiters }: Props) {
  const filterConfig = useMemo(() => buildAppIntakeFilterConfig(recruiters), [recruiters])
  const defaults = useMemo(() => buildAppIntakeFilterDefaults(filterConfig), [filterConfig])
  const { values, onChange, reset } = useEntityFilters(filterConfig, {
    syncUrl: false,
    defaults,
  })
  const listKey = intakeListKeyFromFilters(values)
  const useInitial = listKey.referentScope === 'mine' && listKey.population === 'default'
  const query = trpc.appProfile.listIntakeFollowUp.useQuery(listKey, {
    initialData: useInitial ? initialItems : undefined,
  })
  const items = useMemo(
    () => filterAppIntakeRows(query.data ?? initialItems, values),
    [query.data, initialItems, values],
  )
  const description =
    listKey.population === 'archive'
      ? interimCountLabel(items.length, 'archive')
      : `${interimCountLabel(items.length, 'entrée')} à traiter`

  return (
    <AppIntakeListKeyProvider value={listKey}>
      <SectionCard
        variant="glass"
        title="Entrées app"
        description={description}
        bodyClassName="space-y-4 p-4 sm:p-5"
      >
        <AppIntakeFilterBar
          filterConfig={filterConfig}
          values={values}
          onChange={onChange}
          onReset={reset}
        />
        <AppIntakeFollowUpTable items={items} recruiters={recruiters} />
      </SectionCard>
    </AppIntakeListKeyProvider>
  )
}
