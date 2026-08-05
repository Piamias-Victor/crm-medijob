'use client'

import { useMemo } from 'react'
import { trpc } from '@/lib/trpc/client'
import type { MapEntityType } from '@/lib/map/map-entity-type'
import type { MapLayerState } from '@/lib/map/map-layer-state'
import { toLeanMapPins } from '@/view-models/lean-map-pins'
import type { MapPin } from '@/view-models/map-pins'

export function useExtraMapPins(
  layers: MapLayerState,
  primaryType: MapEntityType,
): Partial<Record<MapEntityType, MapPin[]>> {
  const pharmacy = trpc.pharmacy.mapPins.useQuery(undefined, {
    enabled: layers.pharmacy && primaryType !== 'pharmacy',
  })
  const candidate = trpc.candidate.mapPins.useQuery(undefined, {
    enabled: layers.candidate && primaryType !== 'candidate',
  })
  const mission = trpc.mission.mapPins.useQuery(undefined, {
    enabled: layers.mission && primaryType !== 'mission',
  })

  return useMemo(
    () => ({
      pharmacy: pharmacy.data
        ? toLeanMapPins('pharmacy', pharmacy.data)
        : undefined,
      candidate: candidate.data
        ? toLeanMapPins('candidate', candidate.data)
        : undefined,
      mission: mission.data
        ? toLeanMapPins('mission', mission.data)
        : undefined,
    }),
    [pharmacy.data, candidate.data, mission.data],
  )
}
