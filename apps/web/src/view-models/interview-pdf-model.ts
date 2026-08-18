export type InterviewPdfDecision = 'ELIGIBLE' | 'NON_ELIGIBLE' | 'REVIEW'

export type InterviewPdfHero = {
  candidateName: string
  modeLabel: string
  dateLabel: string
  decisionLabel: string
  decision: InterviewPdfDecision
}

export type InterviewPdfKvRow = { label: string; value: string }
export type InterviewPdfScoreRow = { label: string; earned: number; max: number; percent: number }
export type InterviewPdfAnswerRow = { question: string; answer: string; note?: string }
export type InterviewPdfCheckRow = { label: string; checked: boolean }

export type InterviewPdfSection =
  | { key: string; title: string; kind: 'kv'; rows: InterviewPdfKvRow[] }
  | { key: string; title: string; kind: 'scores'; rows: InterviewPdfScoreRow[] }
  | { key: string; title: string; kind: 'answers'; rows: InterviewPdfAnswerRow[] }
  | { key: string; title: string; kind: 'checklist'; rows: InterviewPdfCheckRow[] }

export type InterviewPdfModel = {
  hero: InterviewPdfHero
  sections: InterviewPdfSection[]
}

export type InterviewPdfInput = {
  candidateName: string
  jobTitle: string | null
  city: string | null
  referentName: string | null
  modeLabel: string
  dateLabel: string
  decision: InterviewPdfDecision
  decisionLabel: string
  scores: Record<string, number>
  scoreMax: Record<string, number>
  mapping: Record<string, unknown>
  answers: {
    questions: Record<string, { choiceLabel?: string; note?: string }>
    checklist: Record<string, boolean>
  }
  sections: { id: string; title: string; questions: { id: string; question: string }[] }[]
  checklistItems: { id: string; label: string }[]
}
