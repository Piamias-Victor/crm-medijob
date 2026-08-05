import { StyleSheet } from '@react-pdf/renderer'
import { PDF_BRAND } from './anonymized-profile-colors'

export const anonymizedPdfStyles = StyleSheet.create({
  page: {
    paddingTop: 0,
    paddingBottom: 56,
    paddingHorizontal: 0,
    fontFamily: 'Helvetica',
    color: PDF_BRAND.text,
    backgroundColor: '#FFFFFF',
  },
  hero: {
    backgroundColor: PDF_BRAND.primary,
    paddingTop: 36,
    paddingBottom: 28,
    paddingHorizontal: 44,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  brand: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  heroTitle: {
    marginTop: 18,
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
  },
  heroSub: {
    marginTop: 6,
    fontSize: 10,
    color: PDF_BRAND.accent,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  accentBar: {
    height: 5,
    backgroundColor: PDF_BRAND.accent,
  },
  content: {
    paddingTop: 32,
    paddingHorizontal: 44,
  },
  section: {
    marginBottom: 18,
    padding: 16,
    backgroundColor: PDF_BRAND.muted,
    borderLeftWidth: 4,
    borderLeftColor: PDF_BRAND.accent,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  index: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: PDF_BRAND.primary,
    color: '#FFFFFF',
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    paddingTop: 5,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: PDF_BRAND.primary,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  body: {
    fontSize: 11,
    lineHeight: 1.65,
    color: PDF_BRAND.text,
  },
  footer: {
    position: 'absolute',
    bottom: 22,
    left: 44,
    right: 44,
    borderTopWidth: 1,
    borderTopColor: PDF_BRAND.muted,
    paddingTop: 10,
    fontSize: 8,
    color: PDF_BRAND.textMuted,
    textAlign: 'center',
  },
})
