export type InterviewScoringAnswer = {
  label: string
  points: number
  tone: string
}

export type InterviewScoringQuestion = {
  id: string
  question: string
  eliminatoire: boolean
  mainCritere?: string
  suggestedAnswers: InterviewScoringAnswer[]
}

