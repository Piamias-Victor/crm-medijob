import { Document, Page, Path, Svg, Text, View } from '@react-pdf/renderer'
import { PDF_BRAND } from './anonymized-profile-colors'
import { anonymizedPdfStyles as styles } from './anonymized-profile-document.styles'
import type { AnonymizedSection } from '@/view-models/anonymized-dossier'

function BrandLogo() {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24">
      <Path d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z" fill={PDF_BRAND.accent} />
    </Svg>
  )
}

type Props = { sections: AnonymizedSection[] }

export function AnonymizedProfileDocument({ sections }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.hero}>
          <View style={styles.heroRow}>
            <BrandLogo />
            <Text style={styles.brand}>MediJob</Text>
          </View>
          <Text style={styles.heroTitle}>Dossier candidat anonymisé</Text>
          <Text style={styles.heroSub}>Document confidentiel · Usage client</Text>
        </View>
        <View style={styles.accentBar} />
        <View style={styles.content}>
          {sections.map((section, index) => (
            <View key={section.key} style={styles.section} wrap={false}>
              <View style={styles.sectionHead}>
                <Text style={styles.index}>{String(index + 1).padStart(2, '0')}</Text>
                <Text style={styles.sectionTitle}>{section.label}</Text>
              </View>
              <Text style={styles.body}>{section.content}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.footer}>
          Confidentiel — MediJob · Ne pas diffuser hors du circuit de recrutement
        </Text>
      </Page>
    </Document>
  )
}
