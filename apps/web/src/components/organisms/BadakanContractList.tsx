'use client'

import { FileText } from 'lucide-react'
import { BadakanContractListCard } from '@/components/molecules/BadakanContractListCard'
import { EntityGridList } from '@/components/organisms/EntityGridList'
import type { BadakanContractListItem } from '@/view-models/badakan-contract-list'

export function BadakanContractList({ rows }: { rows: BadakanContractListItem[] }) {
  return (
    <EntityGridList
      items={rows}
      getKey={(row) => row.id}
      renderItem={(row) => <BadakanContractListCard row={row} />}
      emptyIcon={FileText}
      emptyTitle="Aucun contrat Badakan"
      emptyDescription="Les contrats Badakan synchronisés apparaîtront ici."
    />
  )
}
