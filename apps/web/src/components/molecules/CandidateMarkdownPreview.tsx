'use client'

import { FileText } from 'lucide-react'
import { cn } from '@/lib/cn'

type Props = {
  title: string
  content: string | null | undefined
  emptyLabel: string
}

export function CandidateMarkdownPreview({ title, content, emptyLabel }: Props) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold text-fg">{title}</h3>
      {content?.trim() ? (
        <pre
          className={cn(
            'max-h-64 overflow-auto rounded-lg border border-border/60 bg-surface/60',
            'whitespace-pre-wrap p-4 text-sm leading-relaxed text-fg',
          )}
        >
          {content}
        </pre>
      ) : (
        <p className="text-sm text-fg-muted">{emptyLabel}</p>
      )}
    </section>
  )
}

export function CandidateDocumentsEmptyState({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-dashed border-border/70 p-4 text-sm text-fg-muted">
      <FileText className="size-4 shrink-0" />
      {label}
    </div>
  )
}
