'use client'

import { Sparkles, Globe, EyeOff } from 'lucide-react'
import type { JobOfferStatus } from '@prisma/client'
import { Button } from '@/components/atoms/Button'
import { jobOfferStatusLabel } from '@/view-models/job-offer-status'

type Props = {
  status: JobOfferStatus | null
  generating: boolean
  publishing: boolean
  onGenerate: () => void
  onPublish: () => void
  onUnpublish: () => void
}

export function MissionOffreToolbar({
  status,
  generating,
  publishing,
  onGenerate,
  onPublish,
  onUnpublish,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-fg-muted">
        {status ? `Statut : ${jobOfferStatusLabel(status)}` : 'Aucune offre pour cette mission.'}
      </p>
      <div className="flex flex-wrap gap-2">
        <Button variant="accent" className="gap-2" disabled={generating || status === 'PUBLIEE'} onClick={onGenerate}>
          <Sparkles className="size-4" />
          {generating ? 'Génération…' : status ? 'Régénérer IA' : 'Générer offre IA'}
        </Button>
        {status && status !== 'PUBLIEE' ? (
          <Button variant="outline" className="gap-2" disabled={publishing} onClick={onPublish}>
            <Globe className="size-4" />
            Publier
          </Button>
        ) : null}
        {status === 'PUBLIEE' ? (
          <Button variant="outline" className="gap-2" disabled={publishing} onClick={onUnpublish}>
            <EyeOff className="size-4" />
            Dépublier
          </Button>
        ) : null}
      </div>
    </div>
  )
}
