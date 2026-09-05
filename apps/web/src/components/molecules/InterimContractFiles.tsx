'use client'

import { FileText } from 'lucide-react'
import { TABLE_EMPTY_CELL } from '@/lib/constants/table-empty-cell'
import type { BadakanContractListItem } from '@/view-models/badakan-contract-list'

function FileLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={(event) => event.stopPropagation()}
      className="inline-flex items-center gap-1 text-primary underline-offset-2 hover:underline"
    >
      <FileText className="size-3.5" aria-hidden />
      {label}
    </a>
  )
}

export function InterimContractFiles({ row }: { row: BadakanContractListItem }) {
  if (!row.pdfHref && !row.dpaeHref) return <span>{TABLE_EMPTY_CELL}</span>
  return (
    <span className="flex flex-wrap items-center gap-3">
      {row.pdfHref ? <FileLink href={row.pdfHref} label="Contrat" /> : null}
      {row.dpaeHref ? <FileLink href={row.dpaeHref} label="DPAE" /> : null}
    </span>
  )
}
