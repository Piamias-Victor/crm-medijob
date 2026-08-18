import type {
  InterviewAdminQuestion,
  InterviewAdminSection,
} from '@/view-models/interview-admin-sections'

export function emptyAdminAnswer() {
  return { label: '', text: '', points: 0, tone: 'ok' }
}

export function emptyAdminQuestion(): InterviewAdminQuestion {
  return {
    id: crypto.randomUUID(),
    question: '',
    eliminatoire: false,
    mapping: 'none',
    suggestedAnswers: [emptyAdminAnswer()],
  }
}

export function emptyAdminSection(): InterviewAdminSection {
  return { id: crypto.randomUUID(), title: '', questions: [emptyAdminQuestion()] }
}

export function replaceAt<T>(items: T[], index: number, item: T): T[] {
  return items.map((current, currentIndex) => (currentIndex === index ? item : current))
}

export function removeAt<T>(items: T[], index: number): T[] {
  return items.filter((_, currentIndex) => currentIndex !== index)
}
