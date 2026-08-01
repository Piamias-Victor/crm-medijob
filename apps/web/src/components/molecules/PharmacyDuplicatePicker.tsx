'use client'

import { Button } from '@/components/atoms/Button'
import {
  PHARMACY_DUPLICATE_PICKER_HELP,
  pharmacyDuplicateReasonLabel,
} from '@/lib/pharmacy-duplicate-copy'

type PickerMatch = {
  pharmacyId: string
  reason: 'siret' | 'name_city_postal'
  name: string
  city: string | null
}

type Props = {
  matches: PickerMatch[]
  onSelect: (pharmacyId: string) => void
}

export function PharmacyDuplicatePicker({ matches, onSelect }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-fg-muted">{PHARMACY_DUPLICATE_PICKER_HELP}</p>
      <ul className="space-y-2">
        {matches.map((match) => (
          <li key={match.pharmacyId}>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start"
              onClick={() => onSelect(match.pharmacyId)}
            >
              {match.name}
              {match.city ? ` — ${match.city}` : ''}
              {' — '}
              {pharmacyDuplicateReasonLabel(match.reason)}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
