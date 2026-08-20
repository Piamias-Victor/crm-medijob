import { Document, Page, Text, View } from '@react-pdf/renderer'
import { anonymizedPdfStyles as styles } from './anonymized-profile-document.styles'
import type { DevisPdfModel } from '@/view-models/devis-pdf-model'
import { DEVIS_PDF_FOOTER, DEVIS_PDF_TITLE } from '@/view-models/devis-pdf-copy'
import { formatDevisPdfAmount } from '@/view-models/devis-pdf-format'

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.section} wrap={false}>
      <Text style={styles.sectionTitle}>{label}</Text>
      <Text style={styles.body}>{value}</Text>
    </View>
  )
}

export function DevisPdfDocument({ model }: { model: DevisPdfModel }) {
  const contact = model.destinataire.contactName
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.hero}>
          <Text style={styles.brand}>MediJob</Text>
          <Text style={styles.heroTitle}>{DEVIS_PDF_TITLE}</Text>
          <Text style={styles.heroSub}>{model.missionTitle}</Text>
        </View>
        <View style={styles.accentBar} />
        <View style={styles.content}>
          <Row label="Destinataire" value={model.destinataire.pharmacyName} />
          {contact ? <Row label="Contact" value={contact} /> : null}
          <Row label="Type" value={model.kindLabel} />
          {model.hours != null ? <Row label="Heures" value={String(model.hours)} /> : null}
          {model.hourlyRate != null ? (
            <Row label="Taux horaire HT" value={formatDevisPdfAmount(model.hourlyRate)} />
          ) : null}
          {model.amountHt != null ? (
            <Row label="Total HT" value={formatDevisPdfAmount(model.amountHt)} />
          ) : null}
          {model.amountTtc != null ? (
            <Row label="Total TTC" value={formatDevisPdfAmount(model.amountTtc)} />
          ) : null}
        </View>
        <Text style={styles.footer}>{DEVIS_PDF_FOOTER}</Text>
      </Page>
    </Document>
  )
}
