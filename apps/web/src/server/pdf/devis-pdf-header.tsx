import { Text, View } from '@react-pdf/renderer'
import { devisPdfStyles as styles } from './devis-pdf-document.styles'
import {
  DEVIS_PDF_DATE,
  DEVIS_PDF_FROM,
  DEVIS_PDF_ISSUER,
  DEVIS_PDF_ISSUER_SUB,
  DEVIS_PDF_OBJECT,
  DEVIS_PDF_TITLE,
  DEVIS_PDF_TO,
} from '@/view-models/devis-pdf-copy'
import type { DevisPdfModel } from '@/view-models/devis-pdf-model'

export function DevisPdfHeader({ model }: { model: DevisPdfModel }) {
  return (
    <>
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>{DEVIS_PDF_ISSUER}</Text>
          <Text style={styles.tagline}>{DEVIS_PDF_ISSUER_SUB}</Text>
        </View>
        <View style={styles.docMeta}>
          <Text style={styles.docTitle}>{DEVIS_PDF_TITLE.toUpperCase()}</Text>
          <Text style={styles.docDate}>
            {DEVIS_PDF_DATE} {model.issuedLabel}
          </Text>
        </View>
      </View>
      <View style={styles.accentBar} />
    </>
  )
}

export function DevisPdfParties({ model }: { model: DevisPdfModel }) {
  return (
    <>
      <View style={styles.parties}>
        <View style={styles.party}>
          <Text style={styles.partyLabel}>{DEVIS_PDF_FROM}</Text>
          <Text style={styles.partyName}>{DEVIS_PDF_ISSUER}</Text>
          <Text style={styles.partySub}>{DEVIS_PDF_ISSUER_SUB}</Text>
        </View>
        <View style={styles.party}>
          <Text style={styles.partyLabel}>{DEVIS_PDF_TO}</Text>
          <Text style={styles.partyName}>{model.destinataire.pharmacyName}</Text>
          {model.destinataire.contactName ? (
            <Text style={styles.partySub}>{model.destinataire.contactName}</Text>
          ) : null}
        </View>
      </View>
      <View style={styles.object}>
        <Text style={styles.objectLabel}>{DEVIS_PDF_OBJECT}</Text>
        <Text style={styles.objectValue}>{model.missionTitle}</Text>
      </View>
    </>
  )
}
