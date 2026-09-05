'use client'

import { FileText } from 'lucide-react'
import { InterimTable } from '@/components/organisms/interim-table/interim-table'
import { contractColumns } from '@/components/organisms/interim-table/interim-table-columns'
import { contractFilterConfig, matchesContract } from '@/lib/filters/badakan-interim-filters'
import type { BadakanContractListItem } from '@/view-models/badakan-contract-list'

export function BadakanContractList({ rows }: { rows: BadakanContractListItem[] }) {
  return (
    <InterimTable
      rows={rows}
      columns={contractColumns}
      filterConfig={contractFilterConfig}
      matches={matchesContract}
      emptyIcon={FileText}
      emptyTitle="Aucun contrat Badakan"
      emptyDescription="Ajustez les filtres pour afficher des résultats."
    />
  )
}
