'use client'

import { Building2 } from 'lucide-react'
import { PharmacyListCard } from '@/components/molecules/PharmacyListCard'
import { EntityGridList } from '@/components/organisms/EntityGridList'
import type { PharmacyListRow } from '@/view-models/pharmacy-list'

type Props = {
  rows: PharmacyListRow[]
}

export function PharmacyList({ rows }: Props) {
  return (
    <EntityGridList
      items={rows}
      getKey={(row) => row.id}
      renderItem={(row) => <PharmacyListCard row={row} />}
      emptyIcon={Building2}
      emptyTitle="Aucune pharmacie"
      emptyDescription="Ajoutez votre première pharmacie au portefeuille."
    />
  )
}
