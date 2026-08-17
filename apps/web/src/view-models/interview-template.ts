import { z } from 'zod'

const suggestedSchema = z.object({
  label: z.string(),
  text: z.string(),
})

const questionSchema = z.object({
  id: z.string(),
  question: z.string(),
  eliminatoire: z.boolean().optional(),
  suggestedAnswers: z.array(suggestedSchema),
})

const sectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  hint: z.string().optional(),
  questions: z.array(questionSchema),
})

export type InterviewRunQuestion = {
  id: string
  question: string
  eliminatoire: boolean
  suggestedAnswers: { label: string; text: string }[]
}

export type InterviewRunSection = {
  id: string
  title: string
  hint?: string
  questions: InterviewRunQuestion[]
}

export function parseInterviewSections(raw: unknown): InterviewRunSection[] {
  const parsed = z.array(sectionSchema).safeParse(raw)
  if (!parsed.success) return []
  return parsed.data.map((section) => ({
    id: section.id,
    title: section.title,
    hint: section.hint,
    questions: section.questions.map((question) => ({
      id: question.id,
      question: question.question,
      eliminatoire: question.eliminatoire === true,
      suggestedAnswers: question.suggestedAnswers.map(({ label, text }) => ({ label, text })),
    })),
  }))
}
