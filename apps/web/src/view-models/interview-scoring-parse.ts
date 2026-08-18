import { z } from 'zod'
import type { InterviewScoringQuestion } from '@/view-models/interview-scoring-catalog'

const suggestedSchema = z.object({
  label: z.string(),
  points: z.number().optional(),
  tone: z.string().optional(),
})

const questionSchema = z.object({
  id: z.string(),
  question: z.string(),
  eliminatoire: z.boolean().optional(),
  mainCritere: z.string().optional(),
  suggestedAnswers: z.array(suggestedSchema),
})

const sectionSchema = z.object({ questions: z.array(questionSchema) })

export function parseScoringCatalog(raw: unknown): InterviewScoringQuestion[] {
  const parsed = z.array(sectionSchema).safeParse(raw)
  if (!parsed.success) return []
  return parsed.data.flatMap((section) =>
    section.questions.map((question) => ({
      id: question.id,
      question: question.question,
      eliminatoire: question.eliminatoire === true,
      mainCritere: question.mainCritere,
      suggestedAnswers: question.suggestedAnswers.map((answer) => ({
        label: answer.label,
        points: answer.points ?? 0,
        tone: answer.tone ?? 'ok',
      })),
    })),
  )
}
