import { StyleSheet } from '@react-pdf/renderer'
import { PDF_BRAND } from './anonymized-profile-colors'

export const devisPdfTableStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    backgroundColor: PDF_BRAND.primary,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  th: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#FFFFFF', letterSpacing: 0.4 },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: PDF_BRAND.muted,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  td: { fontSize: 9, color: PDF_BRAND.text },
  desc: { width: '52%' },
  qty: { width: '12%', textAlign: 'right' },
  unit: { width: '18%', textAlign: 'right' },
  total: { width: '18%', textAlign: 'right' },
  totals: { marginTop: 18, alignSelf: 'flex-end', width: 240 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  totalLabel: { fontSize: 9, color: PDF_BRAND.textMuted },
  totalValue: { fontSize: 9, fontFamily: 'Helvetica-Bold' },
  ttc: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    backgroundColor: PDF_BRAND.primary,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  ttcLabel: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#FFFFFF' },
  ttcValue: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: PDF_BRAND.accent },
})
