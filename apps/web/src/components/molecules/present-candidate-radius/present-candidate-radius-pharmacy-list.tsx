'use client'

import type { PharmacyInRadiusRow } from '@/view-models/present-candidate-radius'
import { PresentCandidateRadiusPharmacyRow } from '@/components/molecules/present-candidate-radius/present-candidate-radius-pharmacy-row'
import { PRESENT_CANDIDATE_RADIUS_PHARMACY_LIST_LABEL } from '@/lib/constants/present-candidate-radius-copy'

type Props = {
  pharmacies: PharmacyInRadiusRow[]
  selectedIds: string[]
  onToggle: (pharmacyId: string) => void
}

export function PresentCandidateRadiusPharmacyList({ pharmacies, selectedIds, onToggle }: Props) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-fg">
        {PRESENT_CANDIDATE_RADIUS_PHARMACY_LIST_LABEL} ({selectedIds.length}/{pharmacies.length})
      </p>
      <ul className="max-h-64 space-y-2 overflow-y-auto pr-1">
        {pharmacies.map((pharmacy) => (
          <li key={pharmacy.id}>
            <PresentCandidateRadiusPharmacyRow
              pharmacy={pharmacy}
              checked={selectedIds.includes(pharmacy.id)}
              onToggle={() => onToggle(pharmacy.id)}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
