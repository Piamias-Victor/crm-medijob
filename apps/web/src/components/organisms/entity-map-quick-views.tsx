'use client'

import { PharmacyQuickView } from '@/components/organisms/PharmacyQuickView'
import { CandidateQuickView } from '@/components/organisms/CandidateQuickView'
import { MissionQuickView } from '@/components/organisms/MissionQuickView'
import type { MapEntityType } from '@/lib/map/map-entity-type'

type Selection = { entityType: MapEntityType; entityId: string } | null

type Props = {
  selected: Selection
  returnPath: string
  onClose: () => void
}

export function EntityMapQuickViews({ selected, returnPath, onClose }: Props) {
  return (
    <>
      <PharmacyQuickView
        pharmacyId={selected?.entityType === 'pharmacy' ? selected.entityId : null}
        returnPath={returnPath}
        onClose={onClose}
      />
      <CandidateQuickView
        candidateId={selected?.entityType === 'candidate' ? selected.entityId : null}
        returnPath={returnPath}
        onClose={onClose}
      />
      <MissionQuickView
        missionId={selected?.entityType === 'mission' ? selected.entityId : null}
        returnPath={returnPath}
        onClose={onClose}
      />
    </>
  )
}
