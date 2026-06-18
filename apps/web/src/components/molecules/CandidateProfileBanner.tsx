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
      className="flex gap-4 rounded-xl border border-border bg-white p-4 shadow-sm"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-muted text-primary">
        <Info className="size-5" aria-hidden />
      </div>
      <div className="min-w-0 space-y-2">
        <div>
          <p className="text-sm font-semibold text-fg">Profil incomplet pour le matching</p>
          <p className="text-sm text-fg-muted">
            Complétez la localisation pour activer le pré-filtrage distance. L&apos;enregistrement
            reste possible.
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
