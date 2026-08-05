'use client'

import { nonEmptyAnonymizedSections, type AnonymizedDossier } from '@/view-models/anonymized-dossier'

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
    <div className="flex flex-col gap-5 border-l-2 border-accent/40 pl-4">
      {sections.map((section) => (
        <section key={section.key} className="flex flex-col gap-1">
          <h4 className="text-xs font-semibold uppercase tracking-[0.08em] text-fg-muted">
            {section.label}
          </h4>
          <p className="whitespace-pre-wrap font-serif text-[15px] leading-7 text-fg">
            {section.content}
          </p>
        </section>
      ))}
    </div>
  )
}
