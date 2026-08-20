import { z } from 'zod'
import { parseAmount } from '@/lib/finance/calculate-interim-libre'
import { DEVIS_KINDS } from '@/lib/finance/devis-draft'

const optionalAmount = z.preprocess(parseAmount, z.number().min(0).nullable())

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
export const sendDevisSchema = getDevisByMissionSchema
export const acceptDevisSchema = getDevisByMissionSchema
export const deleteDevisDraftSchema = getDevisByMissionSchema
export const markInvoicedSchema = z.object({
  missionId: z.string().min(1),
  invoicedAt: z.coerce.date(),
})
