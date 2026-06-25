'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { PharmacyInRadiusRow } from '@/view-models/present-candidate-radius'

type Props = {
  pharmacy: PharmacyInRadiusRow
  checked: boolean
  onToggle: () => void
}

export function PresentCandidateRadiusPharmacyRow({ pharmacy, checked, onToggle }: Props) {
  const meta = [pharmacy.city, `${pharmacy.distanceKm} km`].filter(Boolean).join(' · ')
  const label = `${pharmacy.name}${meta ? `, ${meta}` : ''}`

  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors',
        checked
          ? 'border-accent/70 bg-accent-muted/50 shadow-sm'
          : 'border-border/60 bg-white/90 hover:border-accent/30',
      )}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onToggle}
        aria-label={label}
      />
      <span
        className={cn(
          'flex size-4 shrink-0 items-center justify-center rounded border',
          checked ? 'border-accent bg-accent text-white' : 'border-border bg-white',
        )}
        aria-hidden
      >
        {checked ? <Check className="size-3 stroke-[3]" /> : null}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-fg">{pharmacy.name}</span>
        {meta ? <span className="block text-xs text-fg-muted">{meta}</span> : null}
      </span>
    </label>
  )
}
