'use client'

import { FileText } from 'lucide-react'
import { LIST_CARD_MEDIA_CLASS } from '@/lib/constants/list-card'
import { ListCardChip } from '@/components/molecules/ListCardChip'
import { ListCardHeader } from '@/components/molecules/ListCardHeader'
import { ListCardMeta } from '@/components/molecules/ListCardMeta'
import { ListCardShell } from '@/components/molecules/ListCardShell'
import type { BadakanContractListItem } from '@/view-models/badakan-contract-list'

function FileLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">
      {label}
    </a>
  )
}

export function BadakanContractListCard({ row }: { row: BadakanContractListItem }) {
  return (
    <ListCardShell>
      <ListCardHeader
        media={
          <span
            className={`grid ${LIST_CARD_MEDIA_CLASS} place-items-center rounded-lg bg-primary-muted text-primary`}
          >
            <FileText className="size-4" aria-hidden />
          </span>
        }
        title={row.recipientName}
        subtitle={row.statusLabel}
      />
      <ListCardMeta>
        <ListCardChip>{row.pharmacyName}</ListCardChip>
        {row.pdfHref ? (
          <ListCardChip>
            <FileLink href={row.pdfHref} label="PDF" />
          </ListCardChip>
        ) : null}
        {row.dpaeHref ? (
          <ListCardChip>
            <FileLink href={row.dpaeHref} label="DPAE" />
          </ListCardChip>
        ) : null}
      </ListCardMeta>
    </ListCardShell>
  )
}
