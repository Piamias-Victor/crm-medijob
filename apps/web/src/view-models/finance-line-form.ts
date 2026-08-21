import { z } from 'zod'
import { FINANCE_LINE_KINDS } from '@/view-models/finance-line'
import { createFinanceLineSchema, type CreateFinanceLineInput } from '@/view-models/finance-line.schema'

export const financeLineFormSchema = z.object({
  pharmacyId: z.string().min(1, 'Pharmacie requise'),
  candidateId: z.string().min(1, 'Candidat requis'),
  missionId: z.string(),
  kind: z.enum(FINANCE_LINE_KINDS),
  hours: z.string(),
  hourlyRate: z.string(),
  amountHt: z.string().min(1, 'Montant HT requis'),
  htSource: z.enum(['ENGINE', 'TYPED']),
  marge: z.string(),
  occurredAt: z.string().min(1, 'Date requise'),
})

export type FinanceLineFormValues = z.infer<typeof financeLineFormSchema>

export const FINANCE_LINE_KIND_OPTIONS = [
  { value: 'PLACEMENT', label: 'Placement' },
  { value: 'INTERIM', label: 'Intérim' },
] as const

export function defaultFinanceLineFormValues(): FinanceLineFormValues {
  return {
    pharmacyId: '',
    candidateId: '',
    missionId: '',
    kind: 'PLACEMENT',
    hours: '',
    hourlyRate: '',
    amountHt: '',
    htSource: 'TYPED',
    marge: '',
    occurredAt: new Date().toISOString().slice(0, 10),
  }
}

export function toCreateFinanceLineInput(values: FinanceLineFormValues): CreateFinanceLineInput {
  return createFinanceLineSchema.parse({
    pharmacyId: values.pharmacyId,
    candidateId: values.candidateId,
    missionId: values.missionId || null,
    kind: values.kind,
    hours: values.hours === '' ? null : Number(values.hours),
    hourlyRate: values.hourlyRate === '' ? null : Number(values.hourlyRate),
    amountHt: Number(values.amountHt),
    htSource: values.htSource,
    marge: values.marge === '' ? null : Number(values.marge),
    occurredAt: values.occurredAt,
  })
}
