import { Document, Page, Path, StyleSheet, Svg, Text, View } from '@react-pdf/renderer'
import { PDF_BRAND } from './anonymized-profile-colors'

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
  brand: {
    fontSize: 18,
    fontWeight: 700,
    color: PDF_BRAND.primary,
  },
  subtitle: {
    fontSize: 10,
    color: PDF_BRAND.textMuted,
    marginTop: 2,
  },
  body: {
    lineHeight: 1.5,
    fontSize: 11,
  },
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

type Props = { content: string }

export function AnonymizedProfileDocument({ content }: Props) {
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
        <Text style={styles.body}>{content}</Text>
        <Text style={styles.footer}>Document confidentiel — MediJob · Généré automatiquement</Text>
      </Page>
    </Document>
  )
}
