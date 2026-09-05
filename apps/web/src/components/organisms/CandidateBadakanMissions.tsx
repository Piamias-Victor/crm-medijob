'use client'

import Link from 'next/link'
import { Badge } from '@/components/atoms/Badge'
import { Spinner } from '@/components/atoms/Spinner'
import { trpc } from '@/lib/trpc/client'

const VARIANT = { PROPOSE: 'warning', VALIDE: 'success', REFUSE: 'error' } as const

export function CandidateBadakanMissions({ candidateId }: { candidateId: string }) {
  const list = trpc.badakanProposal.listByCandidate.useQuery({ candidateId })
  if (list.isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Spinner className="size-5" />
      </div>
    )
  }
  const rows = list.data ?? []
  if (rows.length === 0) {
    return <p className="text-sm text-fg-muted">Aucune mission intérim proposée ou staffée.</p>
  }
  return (
    <ul className="divide-y divide-border/60">
      {rows.map((row) => (
        <li key={row.id}>
          <Link
            href={row.href}
            className="flex items-center justify-between gap-3 py-2.5 hover:bg-accent-muted/20"
          >
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-fg">{row.pharmacyName}</span>
              <span className="block truncate text-xs text-fg-muted">
                {row.jobTitleLabel} · {row.cityLabel} · {row.periodLabel}
                {row.score != null ? ` · ${row.score}%` : ''}
              </span>
            </span>
            <Badge variant={VARIANT[row.status]}>{row.statusLabel}</Badge>
          </Link>
        </li>
      ))}
    </ul>
  )
}
