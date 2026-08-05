'use client'

import { ExternalLink, Building2, MapPin, Download, UserRoundSearch } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { CandidateCvUploadButton } from '@/components/molecules/CandidateCvUploadButton'
import { PRESENT_CANDIDATE_PHARMACY_BUTTON_LABEL } from '@/lib/constants/present-candidate-pharmacy-copy'
import { PRESENT_CANDIDATE_RADIUS_BUTTON_LABEL } from '@/lib/constants/present-candidate-radius-copy'
import { candidateAnonymizedPdfPath } from '@/lib/candidate-anonymized-pdf-url'
import { candidateCvApiPath } from '@/lib/candidate-cv-url'
import { cn } from '@/lib/cn'

type Props = {
  candidateId: string
  hasCv: boolean
  hasSummary: boolean
  hasAnonymized: boolean
  anonymizedPending: boolean
  submitting: boolean
  onFile: (file: File) => void
  onGenerateAnonymized: () => void
  onPresentPharmacy?: () => void
  onPresentRadius?: () => void
}

const linkClass = cn(
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-border/70',
  'bg-transparent px-4 py-2 text-sm font-medium text-fg transition-colors hover:bg-surface',
)

export function CandidateCvActionsBar({
  candidateId,
  hasCv,
  hasSummary,
  hasAnonymized,
  anonymizedPending,
  submitting,
  onFile,
  onGenerateAnonymized,
  onPresentPharmacy,
  onPresentRadius,
}: Props) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <CandidateCvUploadButton submitting={submitting} onFile={onFile} />
      <div className="flex flex-wrap items-center gap-2">
        {hasCv ? (
          <a
            href={candidateCvApiPath(candidateId)}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            <ExternalLink className="size-4" />
            Voir le CV
          </a>
        ) : null}
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          disabled={!hasSummary || anonymizedPending}
          onClick={onGenerateAnonymized}
        >
          <UserRoundSearch className="size-4" />
          {anonymizedPending ? 'Génération…' : hasAnonymized ? 'Régénérer dossier' : 'Dossier anonymisé'}
        </Button>
        {hasAnonymized ? (
          <a
            href={candidateAnonymizedPdfPath(candidateId)}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
            download
          >
            <Download className="size-4" />
            Télécharger anonymisé
          </a>
        ) : null}
        {onPresentPharmacy ? (
          <Button type="button" variant="outline" className="gap-2" onClick={onPresentPharmacy}>
            <Building2 className="size-4 shrink-0" />
            {PRESENT_CANDIDATE_PHARMACY_BUTTON_LABEL}
          </Button>
        ) : null}
        {onPresentRadius ? (
          <Button type="button" variant="outline" className="gap-2" onClick={onPresentRadius}>
            <MapPin className="size-4 shrink-0" />
            {PRESENT_CANDIDATE_RADIUS_BUTTON_LABEL}
          </Button>
        ) : null}
      </div>
    </div>
  )
}
