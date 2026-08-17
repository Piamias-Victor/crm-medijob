import { z } from 'zod'

export const interviewQuestionAnswerSchema = z.object({
  choiceLabel: z.string().optional(),
  note: z.string().optional(),
})

export const interviewDraftAnswersSchema = z.object({
  questions: z.record(z.string(), interviewQuestionAnswerSchema),
  checklist: z.record(z.string(), z.boolean()),
})

export type InterviewDraftAnswers = z.infer<typeof interviewDraftAnswersSchema>

export const interviewSaveDraftSchema = z.object({
  id: z.string().min(1),
  answers: interviewDraftAnswersSchema,
})

export function parseInterviewAnswers(raw: unknown): InterviewDraftAnswers {
  const parsed = interviewDraftAnswersSchema.safeParse(raw)
  return parsed.success ? parsed.data : { questions: {}, checklist: {} }
}
