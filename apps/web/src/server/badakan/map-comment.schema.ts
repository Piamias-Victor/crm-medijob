import { z } from 'zod'

const authorSchema = z
  .object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    name: z.string().optional(),
  })
  .passthrough()

export const badakanCommentItemSchema = z
  .object({
    id: z.union([z.string(), z.number()]).optional(),
    comment: z.string().optional(),
    content: z.string().optional(),
    creationDate: z.string().optional(),
    createdAt: z.string().optional(),
    author: authorSchema.optional(),
  })
  .passthrough()

export const badakanCommentsEnvelopeSchema = z.union([
  z.array(z.unknown()),
  z.object({ content: z.array(z.unknown()) }).passthrough(),
  z.object({ comments: z.array(z.unknown()) }).passthrough(),
])

export type BadakanCommentItemRaw = z.infer<typeof badakanCommentItemSchema>
