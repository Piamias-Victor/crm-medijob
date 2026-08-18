import { interviewQuestionKind, type InterviewQuestionKind } from '@/view-models/interview-question-kind'
import type { InterviewCloseMapping } from '@/view-models/interview-close-mapping'

export function interviewRunWidgetKind(question: {
  question: string
  mapping?: InterviewCloseMapping | null
}): InterviewQuestionKind {
  if (question.mapping === 'software' || question.mapping === 'availability') {
    return question.mapping
  }
  return interviewQuestionKind(question.question)
}
