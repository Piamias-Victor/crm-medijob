'use client'

import { Info } from 'lucide-react'
import { Badge } from '@/components/atoms/Badge'
import { PHARMACY_FIELD_LABELS } from '@/view-models/pharmacy-profile'

type Props = { missingFields: string[] }

export function PharmacyProfileBanner({ missingFields }: Props) {
  if (missingFields.length === 0) return null

  const labels = missingFields.map((f) => PHARMACY_FIELD_LABELS[f] ?? f)

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
          <p className="text-sm font-semibold text-fg">Localisation incomplète</p>
          <p className="text-sm text-fg-muted">Renseignez la ville et le code postal pour localiser l’officine.</p>
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
