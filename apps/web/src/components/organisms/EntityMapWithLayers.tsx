'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { EntityMap } from '@/components/molecules/EntityMap'
import { EntityMapLayerToggles } from '@/components/molecules/entity-map-layer-toggles'
import { useExtraMapPins } from '@/components/organisms/use-extra-map-pins'
import type { MapEntityType } from '@/lib/map/map-entity-type'
import { mapPinDetailHref } from '@/lib/map/map-pin-href'
import {
  defaultLayerState,
  toggleMapLayer,
} from '@/lib/map/map-layer-state'
import { mergeVisibleMapPins } from '@/lib/map/merge-visible-map-pins'
import type { MapPin } from '@/view-models/map-pins'

type Props = {
  primaryType: MapEntityType
  primaryPins: MapPin[]
  returnPath: string
}

export function EntityMapWithLayers({
  primaryType,
  primaryPins,
  returnPath,
}: Props) {
  const router = useRouter()
  const [layers, setLayers] = useState(() => defaultLayerState(primaryType))
  const extras = useExtraMapPins(layers, primaryType)
  const pins = useMemo(
    () =>
      mergeVisibleMapPins({ layers, primaryType, primaryPins, extras }),
    [layers, primaryType, primaryPins, extras],
  )

  return (
    <div className="space-y-3">
      <EntityMapLayerToggles
        layers={layers}
        onToggle={(type) => setLayers((s) => toggleMapLayer(s, type))}
      />
      <EntityMap
        pins={pins}
        onPinClick={(pin) =>
          router.push(mapPinDetailHref(pin.entityType, pin.entityId, returnPath))
        }
      />
    </div>
  )
}
