'use client'

import { Download, UserRoundSearch } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { candidateAnonymizedPdfPath } from '@/lib/candidate-anonymized-pdf-url'
import { candidateCvApiPath } from '@/lib/candidate-cv-url'
import { cn } from '@/lib/cn'

type Props = {
  candidateId: string
  hasCv: boolean
  hasSummary: boolean
  hasAnonymized: boolean
  anonymizedPending: boolean
  anonymizedError?: string
  onGenerateAnonymized: () => void
}

export function CandidateDocumentsAiActions({
  candidateId,
  hasCv,
  hasSummary,
  hasAnonymized,
  anonymizedPending,
  anonymizedError,
  onGenerateAnonymized,
}: Props) {
  return (
    <div className="flex flex-col gap-4 border-b border-border/60 pb-6">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="accent"
          disabled={!hasSummary || anonymizedPending}
          onClick={onGenerateAnonymized}
          className="gap-2"
        >
          <UserRoundSearch className="size-4" />
          {anonymizedPending ? 'Génération…' : 'Générer dossier anonymisé'}
        </Button>
        {hasAnonymized ? (
          <a
            href={candidateAnonymizedPdfPath(candidateId)}
            className={cn(
              'inline-flex items-center gap-2 rounded-md border border-border/70 px-4 py-2',
              'text-sm font-medium text-fg transition-colors hover:bg-surface',
            )}
          >
            <Download className="size-4" />
            Exporter PDF
          </a>
        ) : null}
        {hasCv ? (
          <a
            href={candidateCvApiPath(candidateId)}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex items-center gap-2 rounded-md border border-border/70 px-4 py-2',
              'text-sm font-medium text-fg transition-colors hover:bg-surface',
            )}
          >
            Voir le CV
          </a>
        ) : null}
      </div>
      {anonymizedError ? <p className="text-sm text-error">{anonymizedError}</p> : null}
    </div>
  )
}
