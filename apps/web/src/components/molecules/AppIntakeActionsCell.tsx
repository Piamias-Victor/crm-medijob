'use client'

import Link from 'next/link'
import { AppIntakeIgnoreCell } from '@/components/molecules/AppIntakeIgnoreCell'
import type { AppProfileListItem } from '@/view-models/app-profile-list'

type Props = { row: AppProfileListItem }

export function AppIntakeActionsCell({ row }: Props) {
  return (
    <div className="flex items-center gap-1">
      {row.candidateId ? (
        <Link
          href={`/candidats/${row.candidateId}`}
          className="px-2 py-1 text-xs font-medium text-accent-hover underline-offset-2 hover:underline"
        >
          Fiche
        </Link>
      ) : null}
      <AppIntakeIgnoreCell row={row} />
    </div>
  )
}
