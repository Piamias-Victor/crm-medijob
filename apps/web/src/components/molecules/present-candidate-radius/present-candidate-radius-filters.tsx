'use client'

import { Input } from '@/components/atoms/Input'
import { FormField } from '@/components/molecules/FormField'
import {
  PRESENT_CANDIDATE_RADIUS_CENTER_HINT,
  PRESENT_CANDIDATE_RADIUS_CENTER_LABEL,
  PRESENT_CANDIDATE_RADIUS_RADIUS_LABEL,
} from '@/lib/constants/present-candidate-radius-copy'

type Props = {
  radiusKm: number
  centerLabel: string
  onRadiusChange: (value: number) => void
}

export function PresentCandidateRadiusFilters({ radiusKm, centerLabel, onRadiusChange }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField label={PRESENT_CANDIDATE_RADIUS_RADIUS_LABEL}>
        <Input
          type="number"
          min={1}
          max={200}
          value={radiusKm}
          onChange={(event) => onRadiusChange(Number(event.target.value))}
        />
      </FormField>
      <FormField label={PRESENT_CANDIDATE_RADIUS_CENTER_LABEL}>
        <Input value={centerLabel || '—'} readOnly />
        <p className="text-xs text-fg-muted">{PRESENT_CANDIDATE_RADIUS_CENTER_HINT}</p>
      </FormField>
    </div>
  )
}
