import { z } from 'zod'

export const assistantContextSchema = z.object({
  entityType: z.enum(['candidate', 'pharmacy', 'mission']).optional(),
  entityId: z.string().optional(),
})

export type AssistantContext = z.infer<typeof assistantContextSchema>

export const chatInputSchema = z
  .object({
    message: z.string().min(1).max(4000).optional(),
    shortcutId: z.string().optional(),
    context: assistantContextSchema.optional(),
  })
  .refine((input) => Boolean(input.message ?? input.shortcutId), {
    message: 'Un message ou un raccourci est requis.',
  })

export type ChatInput = z.infer<typeof chatInputSchema>

export const searchInputSchema = z.object({
  entityType: z.enum(['candidate', 'pharmacy', 'mission']),
  term: z.string().max(100),
})

export type SearchInput = z.infer<typeof searchInputSchema>
