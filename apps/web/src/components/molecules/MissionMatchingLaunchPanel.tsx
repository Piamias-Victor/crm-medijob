'use client'

import { useState } from 'react'
import { Sparkles, Zap } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { DEFAULT_MOBILITY_RADIUS_KM } from '@/view-models/candidate-mobility'

type Props = {
  jobTitleName: string
  pharmacyName: string
  pending: boolean
  onLaunch: (radiusKm: number) => void
}

function parseRadiusKm(raw: string): number {
  const value = Number(raw.trim())
  if (!Number.isInteger(value) || value < 1 || value > 500) return DEFAULT_MOBILITY_RADIUS_KM
  return value
}

export function MissionMatchingLaunchPanel({
  jobTitleName,
  pharmacyName,
  pending,
  onLaunch,
}: Props) {
  const [radiusKm, setRadiusKm] = useState(String(DEFAULT_MOBILITY_RADIUS_KM))

  return (
    <div className="overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-br from-accent-muted/50 via-white to-primary-muted/35 shadow-sm">
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-4">
          <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-accent to-primary text-white shadow-md shadow-accent/25">
            <Sparkles className="size-5" aria-hidden />
          </div>
          <div className="space-y-1">
            <p className="text-base font-semibold text-fg">Trouver les meilleurs profils</p>
            <p className="text-sm text-fg-muted">
              {jobTitleName} · {pharmacyName}
            </p>
            <p className="flex items-center gap-1.5 text-xs text-fg-muted">
              <Zap className="size-3.5 text-accent" aria-hidden />
              Pré-filtre instantané, puis scoring IA (max 20)
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:items-end">
          <label className="flex items-center gap-2 text-sm text-fg-muted">
            <span className="whitespace-nowrap">Rayon (km)</span>
            <Input
              type="text"
              inputMode="numeric"
              value={radiusKm}
              onChange={(e) => setRadiusKm(e.target.value)}
              className="w-20"
              aria-label="Rayon de recherche en km"
            />
          </label>
          <Button
            variant="accent"
            type="button"
            disabled={pending}
            onClick={() => onLaunch(parseRadiusKm(radiusKm))}
            className="gap-2 px-5 shadow-sm"
          >
            <Sparkles className="size-4" aria-hidden />
            {pending ? 'Analyse en cours…' : 'Lancer l’analyse IA'}
          </Button>
        </div>
      </div>
    </div>
  )
}
