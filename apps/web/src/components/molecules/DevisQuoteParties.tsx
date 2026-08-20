import {
  DEVIS_PDF_FROM,
  DEVIS_PDF_ISSUER,
  DEVIS_PDF_ISSUER_SUB,
  DEVIS_PDF_OBJECT,
  DEVIS_PDF_TO,
} from '@/view-models/devis-pdf-copy'
import type { DevisPdfModel } from '@/view-models/devis-pdf-model'

export function DevisQuoteParties({ quote }: { quote: DevisPdfModel }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="bg-primary-muted p-4">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-fg-muted">
            {DEVIS_PDF_FROM}
          </p>
          <p className="mt-1 text-sm font-semibold">{DEVIS_PDF_ISSUER}</p>
          <p className="mt-0.5 text-sm text-fg-muted">{DEVIS_PDF_ISSUER_SUB}</p>
        </div>
        <div className="bg-primary-muted p-4">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-fg-muted">
            {DEVIS_PDF_TO}
          </p>
          <p className="mt-1 text-sm font-semibold">{quote.destinataire.pharmacyName}</p>
          {quote.destinataire.contactName ? (
            <p className="mt-0.5 text-sm text-fg-muted">{quote.destinataire.contactName}</p>
          ) : null}
        </div>
      </div>
      <div className="border-b border-border pb-4">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-fg-muted">
          {DEVIS_PDF_OBJECT}
        </p>
        <p className="mt-1 text-sm font-semibold">{quote.missionTitle}</p>
      </div>
    </>
  )
}
