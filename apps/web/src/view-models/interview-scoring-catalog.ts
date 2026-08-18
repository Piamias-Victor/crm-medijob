import type { InterviewCloseMapping } from '@/view-models/interview-close-mapping'

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
  mapping?: InterviewCloseMapping
  suggestedAnswers: InterviewScoringAnswer[]
}

