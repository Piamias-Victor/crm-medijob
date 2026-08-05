'use client'

import { MAP_ENTITY_TYPES, type MapEntityType } from '@/lib/map/map-entity-type'
import { MAP_LAYER_LABELS } from '@/lib/map/map-layer-labels'
import type { MapLayerState } from '@/lib/map/map-layer-state'
import { cn } from '@/lib/cn'

type Props = {
  layers: MapLayerState
  onToggle: (type: MapEntityType) => void
}

const DOT_CLASS: Record<MapEntityType, string> = {
  pharmacy: 'bg-[var(--color-accent)]',
  candidate: 'bg-[var(--color-sky)]',
  mission: 'bg-[var(--color-rose)]',
}

export function EntityMapLayerToggles({ layers, onToggle }: Props) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Couches carte">
      {MAP_ENTITY_TYPES.map((type) => {
        const on = layers[type]
        return (
          <label
            key={type}
            className={cn(
              'inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors',
              on
                ? 'border-accent bg-accent-muted text-accent-hover'
                : 'border-border bg-white text-fg hover:border-accent/50',
            )}
          >
            <input
              type="checkbox"
              className="sr-only"
              checked={on}
              onChange={() => onToggle(type)}
            />
            <span className={cn('size-2.5 rounded-full', DOT_CLASS[type])} />
            {MAP_LAYER_LABELS[type]}
          </label>
        )
      })}
    </div>
  )
}
