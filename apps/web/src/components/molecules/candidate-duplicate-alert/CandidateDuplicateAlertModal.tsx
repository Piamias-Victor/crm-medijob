'use client'

import { GlassModal } from '@/components/molecules/GlassModal'
import { Button } from '@/components/atoms/Button'
import type { DuplicateMatch } from '@/server/candidate/detect-duplicate.types'
import {
  DUPLICATE_ALERT_CONTINUE,
  DUPLICATE_ALERT_DESCRIPTION,
  DUPLICATE_ALERT_DESCRIPTION_CV,
  DUPLICATE_ALERT_DESCRIPTION_MERGE,
  DUPLICATE_ALERT_EDIT,
  DUPLICATE_ALERT_MERGE,
  DUPLICATE_ALERT_TITLE,
  duplicateMatchLabel,
  duplicateReasonLabel,
} from '@/components/molecules/candidate-duplicate-alert/candidate-duplicate-alert-copy'

type Props = {
  open: boolean
  matches: DuplicateMatch[]
  onContinue: () => void
  onClose: () => void
  onEdit: (candidateId: string) => void
  variant?: 'edit' | 'merge' | 'merge-cv'
  onMerge?: (candidateId: string) => void
}

export function CandidateDuplicateAlertModal({
  open,
  matches,
  onContinue,
  onClose,
  onEdit,
  variant = 'edit',
  onMerge,
}: Props) {
  const single = matches.length === 1 ? matches[0] : null
  const isMerge = variant === 'merge' || variant === 'merge-cv'
  const mergeDescription =
    variant === 'merge-cv' ? DUPLICATE_ALERT_DESCRIPTION_CV : DUPLICATE_ALERT_DESCRIPTION_MERGE

  function primaryAction(candidateId: string) {
    if (isMerge) {
      onMerge?.(candidateId)
      return
    }
    onEdit(candidateId)
  }

  return (
    <GlassModal
      open={open}
      onClose={onClose}
      title={DUPLICATE_ALERT_TITLE}
      description={isMerge ? mergeDescription : DUPLICATE_ALERT_DESCRIPTION}
      className="max-w-md"
      role="alertdialog"
      trapFocus
    >
      <ul className="space-y-2">
        {matches.map((match) => (
          <li key={match.candidateId} className="rounded-lg border border-border/60 bg-surface/40 px-3 py-2 text-sm">
            <p className="font-medium text-fg">{duplicateMatchLabel(match.firstName, match.lastName)}</p>
            <p className="text-fg-muted">{duplicateReasonLabel(match.reason)}</p>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap justify-end gap-3 border-t border-border/50 pt-4">
        <Button type="button" variant="outline" onClick={onContinue}>
          {DUPLICATE_ALERT_CONTINUE}
        </Button>
        {single ? (
          <Button type="button" variant="accent" onClick={() => primaryAction(single.candidateId)}>
            {isMerge ? DUPLICATE_ALERT_MERGE : DUPLICATE_ALERT_EDIT}
          </Button>
        ) : (
          matches.map((match) => (
            <Button
              key={match.candidateId}
              type="button"
              variant="accent"
              onClick={() => primaryAction(match.candidateId)}
            >
              {isMerge ? `${DUPLICATE_ALERT_MERGE} — ${duplicateMatchLabel(match.firstName, match.lastName)}` : duplicateMatchLabel(match.firstName, match.lastName)}
            </Button>
          ))
        )}
      </div>
    </GlassModal>
  )
}
