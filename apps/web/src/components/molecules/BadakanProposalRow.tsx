'use client'

import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { MissionMatchingContactLine } from '@/components/molecules/MissionMatchingContactLine'
import type { BadakanProposalListItem } from '@/view-models/badakan-proposal-list'

const STATUS_VARIANT = {
  PROPOSE: 'sky',
  VALIDE: 'success',
  REFUSE: 'error',
} as const

type Props = {
  row: BadakanProposalListItem
  pending: boolean
  onStatus: (status: 'PROPOSE' | 'VALIDE' | 'REFUSE') => void
  onRemove: () => void
}

export function BadakanProposalRow({ row, pending, onStatus, onRemove }: Props) {
  return (
    <li className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="font-medium text-fg">{row.fullName}</p>
        <p className="text-xs text-fg-muted">
          {row.jobTitle}
          {row.city ? ` · ${row.city}` : ''}
          {row.score != null ? ` · ${row.score}%` : ''}
        </p>
        <MissionMatchingContactLine email={row.email} phone={row.phone} />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={STATUS_VARIANT[row.status]}>{row.statusLabel}</Badge>
        {row.status !== 'VALIDE' ? (
          <Button
            type="button"
            variant="accent"
            disabled={pending}
            className="px-2.5 py-1 text-xs"
            onClick={() => onStatus('VALIDE')}
          >
            Valider
          </Button>
        ) : null}
        {row.status === 'PROPOSE' ? (
          <Button
            type="button"
            variant="ghost"
            disabled={pending}
            className="px-2.5 py-1 text-xs"
            onClick={() => onStatus('REFUSE')}
          >
            Refuser
          </Button>
        ) : null}
        <Button
          type="button"
          variant="ghost"
          disabled={pending}
          className="px-2.5 py-1 text-xs text-error"
          onClick={onRemove}
        >
          Supprimer
        </Button>
      </div>
    </li>
  )
}
