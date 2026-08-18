import { z } from 'zod'
import {
  INTERVIEW_CLOSE_MAPPINGS,
  inferCloseMapping,
  type InterviewCloseMapping,
} from '@/view-models/interview-close-mapping'

const answerSchema = z.object({
  label: z.string(),
  text: z.string().optional().default(''),
  points: z.number().optional().default(0),
  tone: z.string().optional().default('ok'),
})

const questionSchema = z.object({
  id: z.string(),
  question: z.string(),
  eliminatoire: z.boolean().optional().default(false),
  mainCritere: z.string().optional(),
  mapping: z.enum(INTERVIEW_CLOSE_MAPPINGS).optional(),
  suggestedAnswers: z.array(answerSchema),
})

const sectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  hint: z.string().optional(),
  questions: z.array(questionSchema),
})

export type InterviewAdminQuestion = {
  id: string
  question: string
  eliminatoire: boolean
  mainCritere?: string
  mapping: InterviewCloseMapping
  suggestedAnswers: { label: string; text: string; points: number; tone: string }[]
}

export type InterviewAdminSection = {
  id: string
  title: string
  hint?: string
  questions: InterviewAdminQuestion[]
}

export function parseAdminSections(raw: unknown): InterviewAdminSection[] {
  const parsed = z.array(sectionSchema).safeParse(raw)
  if (!parsed.success) return []
  return parsed.data.map((section) => ({
    ...section,
    questions: section.questions.map((question) => ({
      ...question,
      mapping: question.mapping ?? inferCloseMapping(question.question),
    })),
  }))
}

export const interviewAdminWorkingCopySchema = z.object({
  profileKey: z.string().min(1),
  mode: z.enum(['INTERIM', 'CDD_CDI']),
  label: z.string().trim().min(1),
  sections: z.array(sectionSchema),
})

export const interviewTemplateKeySchema = interviewAdminWorkingCopySchema.pick({
  profileKey: true,
  mode: true,
})
