import { Text, View } from '@react-pdf/renderer'
import { interviewPdfBlockStyles as block } from './interview-pdf-block.styles'
import { interviewPdfStyles as styles } from './interview-pdf-document.styles'
import type { InterviewPdfSection } from '@/view-models/interview-pdf-model'

function Kv({ section }: { section: Extract<InterviewPdfSection, { kind: 'kv' }> }) {
  return (
    <>
      {section.rows.map((row) => (
        <View key={row.label} style={styles.kvRow}>
          <Text style={styles.kvLabel}>{row.label}</Text>
          <Text style={styles.kvValue}>{row.value}</Text>
        </View>
      ))}
    </>
  )
}

function Scores({ section }: { section: Extract<InterviewPdfSection, { kind: 'scores' }> }) {
  return (
    <>
      {section.rows.map((row) => (
        <View key={row.label} style={block.scoreRow} wrap={false}>
          <View style={block.scoreHead}>
            <Text style={block.scoreLabel}>{row.label}</Text>
            <Text style={block.scoreValue}>
              {row.earned}/{row.max} · {row.percent}%
            </Text>
          </View>
          <View style={block.track}>
            <View style={[block.fill, { width: `${row.percent}%` }]} />
          </View>
        </View>
      ))}
    </>
  )
}

function Answers({ section }: { section: Extract<InterviewPdfSection, { kind: 'answers' }> }) {
  return (
    <>
      {section.rows.map((row) => (
        <View key={row.question} style={block.answer} wrap={false}>
          <Text style={block.question}>{row.question}</Text>
          <Text style={block.body}>{row.answer}</Text>
          {row.note ? <Text style={block.note}>{row.note}</Text> : null}
        </View>
      ))}
    </>
  )
}

function Checklist({ section }: { section: Extract<InterviewPdfSection, { kind: 'checklist' }> }) {
  return (
    <>
      {section.rows.map((row) => (
        <View key={row.label} style={block.checkRow}>
          <View style={[block.box, row.checked ? block.boxOn : {}]} />
          <Text style={block.checkLabel}>{row.label}</Text>
        </View>
      ))}
    </>
  )
}

export function InterviewPdfSectionBody({ section }: { section: InterviewPdfSection }) {
  if (section.kind === 'kv') return <Kv section={section} />
  if (section.kind === 'scores') return <Scores section={section} />
  if (section.kind === 'answers') return <Answers section={section} />
  return <Checklist section={section} />
}
