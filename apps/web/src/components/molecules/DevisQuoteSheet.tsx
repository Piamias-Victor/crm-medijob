import { DevisQuoteParties } from '@/components/molecules/DevisQuoteParties'
import { DevisQuoteTable } from '@/components/molecules/DevisQuoteTable'
import {
  DEVIS_PDF_DATE,
  DEVIS_PDF_FOOTER,
  DEVIS_PDF_ISSUER,
  DEVIS_PDF_ISSUER_SUB,
  DEVIS_PDF_TITLE,
  DEVIS_PDF_VALIDITY,
} from '@/view-models/devis-pdf-copy'
import type { DevisPdfModel } from '@/view-models/devis-pdf-model'

export function DevisQuoteSheet({ quote }: { quote: DevisPdfModel }) {
  return (
    <article className="bg-white text-primary shadow-lg">
      <header className="flex items-end justify-between bg-primary px-8 py-6 text-primary-fg">
        <div>
          <p className="text-xl font-semibold tracking-wide">{DEVIS_PDF_ISSUER}</p>
          <p className="mt-1 text-xs tracking-wider text-accent">{DEVIS_PDF_ISSUER_SUB}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold tracking-[0.2em]">{DEVIS_PDF_TITLE.toUpperCase()}</p>
          <p className="mt-1 text-xs text-accent">
            {DEVIS_PDF_DATE} {quote.issuedLabel}
          </p>
        </div>
      </header>
      <div className="h-1 bg-accent" />
      <div className="flex flex-col gap-6 px-8 py-7">
        <DevisQuoteParties quote={quote} />
        <DevisQuoteTable quote={quote} />
        <p className="border-t border-border pt-4 text-xs text-fg-muted">
          {DEVIS_PDF_VALIDITY} {DEVIS_PDF_FOOTER}
        </p>
      </div>
    </article>
  )
}
