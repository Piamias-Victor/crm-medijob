'use client'

import { MessageSquare } from 'lucide-react'
import { TABLE_EMPTY_CELL } from '@/lib/constants/table-empty-cell'

type Props = {
  row: { phone: string | null; telHref: string | null; smsHref: string | null }
}

const LINK_CLASS = 'text-accent underline-offset-2 hover:underline'

export function CandidateContactLinks({ row }: Props) {
  if (!row.phone) return <span>{TABLE_EMPTY_CELL}</span>
  return (
    <span className="flex flex-wrap items-center gap-3">
      <a href={row.telHref ?? undefined} onClick={(e) => e.stopPropagation()} className={LINK_CLASS}>
        {row.phone}
      </a>
      {row.smsHref ? (
        <a
          href={row.smsHref}
          onClick={(e) => e.stopPropagation()}
          className={`inline-flex items-center gap-1 ${LINK_CLASS}`}
        >
          <MessageSquare className="size-3.5" aria-hidden />
          SMS
        </a>
      ) : null}
    </span>
  )
}
