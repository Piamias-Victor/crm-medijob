'use client'

import { Building2 } from 'lucide-react'
import { EmptyState } from '@/components/atoms/EmptyState'
import { AnimatedEntityGrid } from '@/components/molecules/AnimatedEntityGrid'
import { PharmacyListCard } from '@/components/molecules/PharmacyListCard'
import type { PharmacyListRow } from '@/view-models/pharmacy-list'

type Props = {
  rows: PharmacyListRow[]
}

export function PharmacyList({ rows }: Props) {
  if (rows.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="Aucune pharmacie"
        description="Ajoutez votre première pharmacie au portefeuille."
      />
    )
  }

  return (
    <AnimatedEntityGrid
      items={rows}
      getKey={(row) => row.id}
      renderItem={(row) => <PharmacyListCard row={row} />}
    />
  )
}
