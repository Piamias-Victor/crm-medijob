import { Document, Page, Text, View } from '@react-pdf/renderer'
import { InterviewPdfHeroBlock } from './interview-pdf-hero'
import { InterviewPdfSectionBody } from './interview-pdf-section-body'
import { interviewPdfStyles as styles } from './interview-pdf-document.styles'
import { INTERVIEW_PDF_FOOTER } from '@/view-models/interview-pdf-copy'
import type { InterviewPdfModel } from '@/view-models/interview-pdf-model'

export function InterviewPdfDocument({ model }: { model: InterviewPdfModel }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <InterviewPdfHeroBlock hero={model.hero} />
        <View style={styles.accentBar} />
        <View style={styles.content}>
          {model.sections.map((section) => (
            <View key={section.key} style={styles.section} wrap={false}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <InterviewPdfSectionBody section={section} />
            </View>
          ))}
        </View>
        <Text style={styles.footer} fixed>
          {INTERVIEW_PDF_FOOTER}
        </Text>
      </Page>
    </Document>
  )
}
