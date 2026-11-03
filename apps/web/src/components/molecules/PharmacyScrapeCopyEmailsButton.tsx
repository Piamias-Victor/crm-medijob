'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import {
  PHARMACY_SCRAPE_COPY_DONE,
  PHARMACY_SCRAPE_COPY_EMAILS,
} from '@/lib/constants/pharmacy-scrape-copy'
import {
  countUniqueScrapeEmails,
  formatScrapeEmailsForClipboard,
} from '@/view-models/pharmacy-scrape-copy-emails'

type Props = { rows: { email: string }[] }

export function PharmacyScrapeCopyEmailsButton({ rows }: Props) {
  const [copied, setCopied] = useState(false)
  const count = countUniqueScrapeEmails(rows)
  if (count === 0) return null

  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm text-fg hover:bg-surface"
      onClick={() => {
        void navigator.clipboard.writeText(formatScrapeEmailsForClipboard(rows)).then(() => {
          setCopied(true)
          window.setTimeout(() => setCopied(false), 2000)
        })
      }}
    >
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      {copied ? PHARMACY_SCRAPE_COPY_DONE : `${PHARMACY_SCRAPE_COPY_EMAILS} (${count})`}
    </button>
  )
}
