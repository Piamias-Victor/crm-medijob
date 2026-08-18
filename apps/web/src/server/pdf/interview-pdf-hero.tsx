import { Path, Svg, Text, View } from '@react-pdf/renderer'
import { PDF_BRAND } from './anonymized-profile-colors'
import { INTERVIEW_PDF_TONES } from './interview-pdf-block.styles'
import { interviewPdfStyles as styles } from './interview-pdf-document.styles'
import { INTERVIEW_PDF_SUB, INTERVIEW_PDF_TITLE } from '@/view-models/interview-pdf-copy'
import type { InterviewPdfHero } from '@/view-models/interview-pdf-model'

function BrandLogo() {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24">
      <Path d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z" fill={PDF_BRAND.accent} />
    </Svg>
  )
}

function Chip({ label, color }: { label: string; color?: string }) {
  return (
    <View style={[styles.chip, color ? { backgroundColor: color } : {}]}>
      <Text style={[styles.chipText, color ? { color: PDF_BRAND.primary } : {}]}>{label}</Text>
    </View>
  )
}

export function InterviewPdfHeroBlock({ hero }: { hero: InterviewPdfHero }) {
  return (
    <View style={styles.hero}>
      <View style={styles.heroTop}>
        <BrandLogo />
        <Text style={styles.brand}>MediJob</Text>
      </View>
      <Text style={styles.kicker}>{INTERVIEW_PDF_SUB}</Text>
      <Text style={styles.name}>{hero.candidateName}</Text>
      <Text style={{ marginTop: 4, fontSize: 11, color: '#FFFFFF' }}>{INTERVIEW_PDF_TITLE}</Text>
      <View style={styles.chips}>
        <Chip label={hero.modeLabel} />
        <Chip label={hero.dateLabel} />
        <Chip label={hero.decisionLabel} color={INTERVIEW_PDF_TONES[hero.decision]} />
      </View>
    </View>
  )
}
