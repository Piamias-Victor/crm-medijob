'use client'

import { ExternalLink } from 'lucide-react'
import { CandidateCvUploadButton } from '@/components/molecules/CandidateCvUploadButton'
import { candidateCvApiPath } from '@/lib/candidate-cv-url'
import { cn } from '@/lib/cn'

type Props = {
  candidateId: string
  hasCv: boolean
  submitting: boolean
  onFile: (file: File) => void
}

export function CandidateCvActionsBar({ candidateId, hasCv, submitting, onFile }: Props) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <CandidateCvUploadButton submitting={submitting} onFile={onFile} />
      {hasCv ? (
        <a
          href={candidateCvApiPath(candidateId)}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-border/70',
            'bg-transparent px-4 py-2 text-sm font-medium text-fg transition-colors hover:bg-surface',
          )}
        >
          <ExternalLink className="size-4" />
          Voir le CV
        </a>
      ) : null}
    </div>
  )
}
