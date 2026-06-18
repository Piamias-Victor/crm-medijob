'use client'

import { Info } from 'lucide-react'
import { Badge } from '@/components/atoms/Badge'
import { MATCHING_FIELD_LABELS } from '@/lib/candidate-options'

type Props = { missingFields: string[] }

export function CandidateProfileBanner({ missingFields }: Props) {
  if (missingFields.length === 0) return null

  const labels = missingFields.map((f) => MATCHING_FIELD_LABELS[f] ?? f)

  return (
    <div
      role="status"
      className="flex gap-3 rounded-xl border border-warning/25 bg-gradient-to-r from-warning/8 via-warning/5 to-transparent p-4"
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-warning/15 text-warning">
        <Info className="size-4" aria-hidden />
      </div>
      <div className="min-w-0 space-y-2">
        <div>
          <p className="text-sm font-semibold text-fg">Profil incomplet pour le matching</p>
          <p className="text-sm text-fg-muted">
            Complétez la localisation et le rayon de mobilité pour activer le pré-filtrage distance.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {labels.map((label) => (
            <Badge key={label} variant="warning">
              {label}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
