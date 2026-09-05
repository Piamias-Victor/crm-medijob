'use client'

import { useMemo } from 'react'
import { SectionCard } from '@/components/molecules/SectionCard'
import { AppProfilesTable } from '@/components/molecules/AppProfilesTable'
import { EntityListFilterBar } from '@/components/organisms/entity-list-filter-bar/entity-list-filter-bar'
import { useEntityFilters } from '@/hooks/use-entity-filters'
import { APP_PROFILE_FILTER_CONFIG } from '@/lib/filters/app-profile-filter-config'
import { filterByPersonSearch } from '@/view-models/person-search'
import type { AppProfileListItem } from '@/view-models/app-profile-list'

type Props = { initialItems: AppProfileListItem[] }

export function AppProfilesSection({ initialItems }: Props) {
  const { values, onChange, reset } = useEntityFilters(APP_PROFILE_FILTER_CONFIG, {
    syncUrl: false,
  })
  const rows = useMemo(
    () => filterByPersonSearch(initialItems, values.q),
    [initialItems, values.q],
  )

  return (
    <SectionCard
      variant="glass"
      title="Profils app"
      description="Nouveaux inscrits Badakan — l’invitation vidéo part automatiquement."
      bodyClassName="space-y-4 p-4 sm:p-5"
    >
      <EntityListFilterBar
        primary={[...APP_PROFILE_FILTER_CONFIG]}
        advanced={[]}
        values={values}
        onChange={onChange}
        onReset={reset}
        advancedCount={0}
      />
      <AppProfilesTable items={rows} filtered={Boolean(values.q.trim())} />
    </SectionCard>
  )
}
