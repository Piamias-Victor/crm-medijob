import { Document, Page, Text, View } from '@react-pdf/renderer'
import { devisPdfStyles as styles } from './devis-pdf-document.styles'
import { DevisPdfHeader, DevisPdfParties } from './devis-pdf-header'
import { DevisPdfTable } from './devis-pdf-table'
import { DEVIS_PDF_FOOTER, DEVIS_PDF_VALIDITY } from '@/view-models/devis-pdf-copy'
import type { DevisPdfModel } from '@/view-models/devis-pdf-model'

export function DevisPdfDocument({ model }: { model: DevisPdfModel }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <DevisPdfHeader model={model} />
        <View style={styles.body}>
          <DevisPdfParties model={model} />
          <DevisPdfTable model={model} />
        </View>
        <Text style={styles.footer}>
          {DEVIS_PDF_VALIDITY} {DEVIS_PDF_FOOTER}
        </Text>
      </Page>
    </Document>
  )
}
