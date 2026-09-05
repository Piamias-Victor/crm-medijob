'use client'

import { UserRoundSearch } from 'lucide-react'
import { InterimTable } from '@/components/organisms/interim-table/interim-table'
import { needColumns } from '@/components/organisms/interim-table/interim-table-columns'
import { matchesNeed, needFilterConfig } from '@/lib/filters/badakan-interim-filters'
import type { BadakanNeedListItem } from '@/view-models/badakan-need-list'

export function BadakanNeedList({
  rows,
  syncUrl = true,
}: {
  rows: BadakanNeedListItem[]
  syncUrl?: boolean
}) {
  return (
    <InterimTable
      rows={rows}
      columns={needColumns}
      filterConfig={needFilterConfig}
      matches={matchesNeed}
      getRowHref={(row) => row.href}
      emptyIcon={UserRoundSearch}
      emptyTitle="Aucun besoin ouvert"
      emptyDescription="Toutes les missions Badakan sont staffées."
      syncUrl={syncUrl}
    />
  )
}
