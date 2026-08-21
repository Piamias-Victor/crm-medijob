import { Text, View } from '@react-pdf/renderer'
import { devisPdfTableStyles as styles } from './devis-pdf-table.styles'
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

export function DevisPdfTable({ model }: { model: DevisPdfModel }) {
  const { line } = model
  return (
    <>
      <View style={styles.header}>
        <Text style={[styles.th, styles.desc]}>{DEVIS_PDF_COL_DESC}</Text>
        <Text style={[styles.th, styles.qty]}>{DEVIS_PDF_COL_QTY}</Text>
        <Text style={[styles.th, styles.unit]}>{DEVIS_PDF_COL_UNIT}</Text>
        <Text style={[styles.th, styles.total]}>{DEVIS_PDF_COL_TOTAL}</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.td, styles.desc]}>{line.designation}</Text>
        <Text style={[styles.td, styles.qty]}>{line.quantity}</Text>
        <Text style={[styles.td, styles.unit]}>{line.unitPrice}</Text>
        <Text style={[styles.td, styles.total]}>{line.totalHt}</Text>
      </View>
      <View style={styles.totals}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>{DEVIS_PDF_TOTAL_HT}</Text>
          <Text style={styles.totalValue}>{formatDevisPdfOrEmpty(model.amountHt, DEVIS_PDF_EMPTY)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>{DEVIS_PDF_TVA}</Text>
          <Text style={styles.totalValue}>{formatDevisPdfOrEmpty(model.tvaAmount, DEVIS_PDF_EMPTY)}</Text>
        </View>
        <View style={styles.ttc}>
          <Text style={styles.ttcLabel}>{DEVIS_PDF_TOTAL_TTC}</Text>
          <Text style={styles.ttcValue}>{formatDevisPdfOrEmpty(model.amountTtc, DEVIS_PDF_EMPTY)}</Text>
        </View>
      </View>
    </>
  )
}
