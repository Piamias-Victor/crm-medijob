'use client'

import { ExternalLink, Link2 } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { useToastStore } from '@/stores/toast-store'
import { PUBLIC_APPLY_LINK_COPY } from '@/view-models/public-apply-link-copy'

type Props = { url: string }

export function JobOfferPublicApplyLink({ url }: Props) {
  const push = useToastStore((s) => s.push)

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-surface-muted/40 p-3">
      <p className="text-xs font-medium text-fg-muted">{PUBLIC_APPLY_LINK_COPY.linkLabel}</p>
      <p className="break-all font-mono text-sm text-fg">{url}</p>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(url)
              push({ variant: 'success', message: PUBLIC_APPLY_LINK_COPY.copied })
            } catch {
              push({ variant: 'error', message: PUBLIC_APPLY_LINK_COPY.copyError })
            }
          }}
        >
          <Link2 className="size-4" />
          {PUBLIC_APPLY_LINK_COPY.copyLink}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
        >
          <ExternalLink className="size-4" />
          {PUBLIC_APPLY_LINK_COPY.openLink}
        </Button>
      </div>
    </div>
  )
}
