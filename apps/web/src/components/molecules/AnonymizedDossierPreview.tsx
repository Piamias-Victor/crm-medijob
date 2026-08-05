'use client'

import { nonEmptyAnonymizedSections, type AnonymizedDossier } from '@/view-models/anonymized-dossier'
import { cn } from '@/lib/cn'

type Props = {
  dossier: AnonymizedDossier
  emptyLabel: string
}

export function AnonymizedDossierPreview({ dossier, emptyLabel }: Props) {
  const sections = nonEmptyAnonymizedSections(dossier)
  if (sections.length === 0) {
    return <p className="text-sm text-fg-muted">{emptyLabel}</p>
  }
  return (
    <div className="flex flex-col gap-4">
      {sections.map((section) => (
        <section key={section.key} className="flex flex-col gap-1">
          <h4 className="text-sm font-semibold text-fg">{section.label}</h4>
          <pre
            className={cn(
              'whitespace-pre-wrap rounded-lg border border-border/60 bg-surface/60',
              'p-3 text-sm leading-relaxed text-fg',
            )}
          >
            {section.content}
          </pre>
        </section>
      ))}
    </div>
  )
}
