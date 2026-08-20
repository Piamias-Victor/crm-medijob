import { z } from 'zod'

const optionalMarge = z.preprocess(
  (v) => (v === '' || v === null || v === undefined ? null : Number(v)),
  z.number().nullable(),
)

export const updateMargeSchema = z.object({
  id: z.string().min(1),
  marge: optionalMarge,
})
