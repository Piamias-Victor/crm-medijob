import { z } from 'zod'
import { DEVIS_KINDS } from '@/lib/finance/devis-draft'

const optionalAmount = z.preprocess(
  (v) => (v === '' || v === null || v === undefined ? null : Number(v)),
  z.number().min(0).nullable(),
)

export const getDevisByMissionSchema = z.object({
  missionId: z.string().min(1),
})

export const saveDevisDraftSchema = z.object({
  missionId: z.string().min(1),
  kind: z.enum(DEVIS_KINDS),
  hours: optionalAmount,
  hourlyRate: optionalAmount,
  amountHt: optionalAmount,
  htSource: z.enum(['ENGINE', 'TYPED']),
})

export type SaveDevisDraftInput = z.infer<typeof saveDevisDraftSchema>
export const devisFormSchema = saveDevisDraftSchema.omit({ missionId: true })
