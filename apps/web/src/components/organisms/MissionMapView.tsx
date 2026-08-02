'use client'

import { useMemo, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { EntityMap } from '@/components/molecules/EntityMap'
import { MissionQuickView } from '@/components/organisms/MissionQuickView'
import { toMissionMapPins } from '@/view-models/entity-map-pins'
import type { RawMission } from '@/view-models/mission-kanban.types'

type Props = { missions: RawMission[] }

export function MissionMapView({ missions }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [quickViewId, setQuickViewId] = useState<string | null>(null)
  const pins = useMemo(() => toMissionMapPins(missions), [missions])
  const returnPath = useMemo(() => {
    const query = searchParams.toString()
    return query ? `${pathname}?${query}` : pathname
  }, [pathname, searchParams])

  return (
    <>
      <EntityMap pins={pins} onPinClick={setQuickViewId} />
      <MissionQuickView
        missionId={quickViewId}
        returnPath={returnPath}
        onClose={() => setQuickViewId(null)}
      />
    </>
  )
}
