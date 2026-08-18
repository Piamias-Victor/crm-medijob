import { StyleSheet } from '@react-pdf/renderer'
import { PDF_BRAND } from './anonymized-profile-colors'

export const INTERVIEW_PDF_TONES = {
  ELIGIBLE: PDF_BRAND.accent,
  REVIEW: '#E8B84C',
  NON_ELIGIBLE: '#F07167',
} as const

export const interviewPdfBlockStyles = StyleSheet.create({
  scoreRow: { marginBottom: 8 },
  scoreHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  scoreLabel: { fontSize: 9, color: PDF_BRAND.text },
  scoreValue: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: PDF_BRAND.primary },
  track: { height: 6, borderRadius: 3, backgroundColor: '#C5D5D8' },
  fill: { height: 6, borderRadius: 3, backgroundColor: PDF_BRAND.accent },
  answer: { marginBottom: 10 },
  question: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: PDF_BRAND.primary, marginBottom: 3 },
  body: { fontSize: 10, lineHeight: 1.45, color: PDF_BRAND.text },
  note: { marginTop: 3, fontSize: 9, color: PDF_BRAND.textMuted },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 5 },
  box: {
    width: 11,
    height: 11,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: PDF_BRAND.primary,
  },
  boxOn: { backgroundColor: PDF_BRAND.accent, borderColor: PDF_BRAND.accent },
  checkLabel: { fontSize: 10, color: PDF_BRAND.text },
})
