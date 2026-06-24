'use client'

import { Button } from '@/components/atoms/Button'
import type { DuplicateMatch } from '@/server/candidate/detect-duplicate.types'
import {
  DUPLICATE_PICKER_HELP,
  duplicateReasonLabel,
} from '@/components/organisms/candidate-duplicate-review/candidate-duplicate-review-copy'

type Props = {
  matches: DuplicateMatch[]
  onSelect: (candidateId: string) => void
}

export function CandidateDuplicatePicker({ matches, onSelect }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-fg-muted">{DUPLICATE_PICKER_HELP}</p>
      <ul className="space-y-2">
        {matches.map((match) => (
          <li key={match.candidateId}>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start"
              onClick={() => onSelect(match.candidateId)}
            >
              {match.firstName} {match.lastName} — {duplicateReasonLabel(match.reason)}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
