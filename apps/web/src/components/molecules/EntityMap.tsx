'use client'

import dynamic from 'next/dynamic'
import type { MapPin } from '@/view-models/map-pins'

const EntityMapCanvas = dynamic(
  () => import('@/components/molecules/EntityMapCanvas').then((m) => m.EntityMapCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[420px] items-center justify-center rounded-lg border border-border/60 bg-surface text-sm text-fg-muted">
        Chargement de la carte…
      </div>
    ),
  },
)

type Props = {
  pins: MapPin[]
  onPinClick?: (id: string) => void
  emptyLabel?: string
}

export function EntityMap({ pins, onPinClick, emptyLabel }: Props) {
  if (pins.length === 0) {
    return (
      <div className="flex h-[420px] items-center justify-center rounded-lg border border-dashed border-border bg-surface text-sm text-fg-muted">
        {emptyLabel ?? 'Aucun point géolocalisé pour ces filtres.'}
      </div>
    )
  }
  return <EntityMapCanvas pins={pins} onPinClick={onPinClick} />
}
