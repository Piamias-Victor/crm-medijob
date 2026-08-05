'use client'

import { useMemo } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { EntityMapWithLayers } from '@/components/organisms/EntityMapWithLayers'
import { toMissionMapPins } from '@/view-models/entity-map-pins'
import type { RawMission } from '@/view-models/mission-kanban.types'

type Props = { missions: RawMission[] }

export function MissionMapView({ missions }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const pins = useMemo(() => toMissionMapPins(missions), [missions])
  const returnPath = useMemo(() => {
    const query = searchParams.toString()
    return query ? `${pathname}?${query}` : pathname
  }, [pathname, searchParams])

  return (
    <EntityMapWithLayers
      primaryType="mission"
      primaryPins={pins}
      returnPath={returnPath}
    />
  )
}
