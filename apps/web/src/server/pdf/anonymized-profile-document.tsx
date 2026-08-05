import { Document, Page, Path, StyleSheet, Svg, Text, View } from '@react-pdf/renderer'
import { PDF_BRAND } from './anonymized-profile-colors'
import type { AnonymizedSection } from '@/view-models/anonymized-dossier'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: PDF_BRAND.text,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: PDF_BRAND.accent,
  },
  brand: { fontSize: 18, fontWeight: 700, color: PDF_BRAND.primary },
  subtitle: { fontSize: 10, color: PDF_BRAND.textMuted, marginTop: 2 },
  section: { marginBottom: 16 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: PDF_BRAND.primary,
    marginBottom: 6,
  },
  body: { lineHeight: 1.5, fontSize: 11 },
  footer: {
    position: 'absolute',
    bottom: 28,
    left: 40,
    right: 40,
    fontSize: 9,
    color: PDF_BRAND.textMuted,
    textAlign: 'center',
  },
})

function BrandLogo() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <Path d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z" fill={PDF_BRAND.primary} />
    </Svg>
  )
}

type Props = { sections: AnonymizedSection[] }

export function AnonymizedProfileDocument({ sections }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <BrandLogo />
          <View>
            <Text style={styles.brand}>MediJob</Text>
            <Text style={styles.subtitle}>Dossier candidat anonymisé</Text>
          </View>
        </View>
        {sections.map((section) => (
          <View key={section.key} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.label}</Text>
            <Text style={styles.body}>{section.content}</Text>
          </View>
        ))}
        <Text style={styles.footer}>Document confidentiel — MediJob · Généré automatiquement</Text>
      </Page>
    </Document>
  )
}
