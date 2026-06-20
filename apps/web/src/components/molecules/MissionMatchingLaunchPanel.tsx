'use client'

import { Sparkles, Zap } from 'lucide-react'
import { Button } from '@/components/atoms/Button'

type Props = {
  jobTitleName: string
  pharmacyName: string
  pending: boolean
  onLaunch: () => void
}

export function MissionMatchingLaunchPanel({
  jobTitleName,
  pharmacyName,
  pending,
  onLaunch,
}: Props) {
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
              Pré-filtre instantané, puis scoring Gemini (max 20)
            </p>
          </div>
        </div>
        <Button
          variant="accent"
          type="button"
          disabled={pending}
          onClick={onLaunch}
          className="shrink-0 gap-2 px-5 shadow-sm"
        >
          <Sparkles className="size-4" aria-hidden />
          {pending ? 'Analyse en cours…' : 'Lancer l’analyse IA'}
        </Button>
      </div>
    </div>
  )
}
