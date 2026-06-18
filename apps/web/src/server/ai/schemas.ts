import { z } from 'zod'

export const RESPONSE_KINDS = ['chat', 'summary', 'email', 'offer', 'report'] as const

export type ResponseKind = (typeof RESPONSE_KINDS)[number]

export const chatResponseSchema = z.object({ reply: z.string().min(1) })
export const summaryResponseSchema = z.object({ summary: z.string().min(1) })
export const emailResponseSchema = z.object({
  subject: z.string().min(1),
  body: z.string().min(1),
})
export const offerResponseSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(100),
})
export const reportResponseSchema = z.object({ report: z.string().min(1) })

export const responseSchemas = {
  chat: chatResponseSchema,
  summary: summaryResponseSchema,
  email: emailResponseSchema,
  offer: offerResponseSchema,
  report: reportResponseSchema,
} satisfies Record<ResponseKind, z.ZodType>

export type ChatResponse = z.infer<typeof chatResponseSchema>
export type SummaryResponse = z.infer<typeof summaryResponseSchema>
export type EmailResponse = z.infer<typeof emailResponseSchema>
export type OfferResponse = z.infer<typeof offerResponseSchema>
export type ReportResponse = z.infer<typeof reportResponseSchema>
