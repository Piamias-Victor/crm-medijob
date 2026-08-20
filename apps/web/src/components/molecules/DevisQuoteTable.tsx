import {
  DEVIS_PDF_COL_DESC,
  DEVIS_PDF_COL_QTY,
  DEVIS_PDF_COL_TOTAL,
  DEVIS_PDF_COL_UNIT,
  DEVIS_PDF_EMPTY,
  DEVIS_PDF_TOTAL_HT,
  DEVIS_PDF_TOTAL_TTC,
  DEVIS_PDF_TVA,
} from '@/view-models/devis-pdf-copy'
import { formatDevisPdfOrEmpty } from '@/view-models/devis-pdf-format'
import type { DevisPdfModel } from '@/view-models/devis-pdf-model'

export function DevisQuoteTable({ quote }: { quote: DevisPdfModel }) {
  const { line } = quote
  return (
    <div className="flex flex-col gap-5 overflow-x-auto">
      <table className="w-full min-w-[28rem] border-collapse text-sm">
        <thead>
          <tr className="bg-primary text-left text-[0.65rem] uppercase tracking-wide text-primary-fg">
            <th className="px-3 py-2.5 font-semibold">{DEVIS_PDF_COL_DESC}</th>
            <th className="px-3 py-2.5 text-right font-semibold">{DEVIS_PDF_COL_QTY}</th>
            <th className="px-3 py-2.5 text-right font-semibold">{DEVIS_PDF_COL_UNIT}</th>
            <th className="px-3 py-2.5 text-right font-semibold">{DEVIS_PDF_COL_TOTAL}</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border">
            <td className="px-3 py-3">{line.designation}</td>
            <td className="px-3 py-3 text-right">{line.quantity}</td>
            <td className="px-3 py-3 text-right tabular-nums">{line.unitPrice}</td>
            <td className="px-3 py-3 text-right tabular-nums font-medium">{line.totalHt}</td>
          </tr>
        </tbody>
      </table>
      <dl className="ml-auto w-56 text-sm">
        <div className="flex justify-between py-1 text-fg-muted">
          <dt>{DEVIS_PDF_TOTAL_HT}</dt>
          <dd className="tabular-nums font-medium text-fg">
            {formatDevisPdfOrEmpty(quote.amountHt, DEVIS_PDF_EMPTY)}
          </dd>
        </div>
        <div className="flex justify-between py-1 text-fg-muted">
          <dt>{DEVIS_PDF_TVA}</dt>
          <dd className="tabular-nums font-medium text-fg">
            {formatDevisPdfOrEmpty(quote.tvaAmount, DEVIS_PDF_EMPTY)}
          </dd>
        </div>
        <div className="mt-2 flex justify-between bg-primary px-3 py-2.5 text-primary-fg">
          <dt className="font-semibold">{DEVIS_PDF_TOTAL_TTC}</dt>
          <dd className="tabular-nums font-semibold text-accent">
            {formatDevisPdfOrEmpty(quote.amountTtc, DEVIS_PDF_EMPTY)}
          </dd>
        </div>
      </dl>
    </div>
  )
}
