import { z } from 'zod'
import { FINANCE_LINE_KINDS, PLACEMENT_CONTRACT_TYPES } from '@/view-models/finance-line'
import { createFinanceLineSchema, financeLineDevisSchema, type CreateFinanceLineInput, type FinanceLineDevisInput } from '@/view-models/finance-line.schema'
import { requirePlacementContract } from '@/view-models/finance-line-placement'

export const financeLineFormSchema = z
  .object({
    pharmacyId: z.string().min(1, 'Pharmacie requise'),
    candidateId: z.string().min(1, 'Candidat requis'),
    missionId: z.string(),
    kind: z.enum(FINANCE_LINE_KINDS),
    placementContractType: z.string(),
    referentId: z.string(),
    hours: z.string(),
    hourlyRate: z.string(),
    amountHt: z.string().min(1, 'Montant HT requis'),
    htSource: z.enum(['ENGINE', 'TYPED']),
    marge: z.string(),
    occurredAt: z.string().min(1, 'Date requise'),
  })
  .refine((data) => requirePlacementContract(data.kind, data.placementContractType), {
    path: ['placementContractType'],
    message: 'CDD ou CDI requis',
  })

export type FinanceLineFormValues = z.infer<typeof financeLineFormSchema>

export const FINANCE_LINE_KIND_OPTIONS = [
  { value: 'PLACEMENT', label: 'Placement' },
  { value: 'INTERIM', label: 'Intérim' },
] as const

export const PLACEMENT_TYPE_OPTIONS = PLACEMENT_CONTRACT_TYPES.map((value) => ({
  value,
  label: value,
}))

export function defaultFinanceLineFormValues(): FinanceLineFormValues {
  return {
    pharmacyId: '',
    candidateId: '',
    missionId: '',
    kind: 'PLACEMENT',
    placementContractType: '',
    referentId: '',
    hours: '',
    hourlyRate: '',
    amountHt: '',
    htSource: 'TYPED',
    marge: '',
    occurredAt: new Date().toISOString().slice(0, 10),
  }
}

export function toCreateFinanceLineInput(
  values: FinanceLineFormValues,
  devisId?: string | null,
): CreateFinanceLineInput {
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
    devisId: devisId || undefined,
    placementContractType: values.placementContractType || null,
    referentId: values.referentId || null,
  })
}

export function toFinanceLineDevisInput(
  values: FinanceLineFormValues,
  devisId?: string | null,
): FinanceLineDevisInput {
  return financeLineDevisSchema.parse({
    pharmacyId: values.pharmacyId,
    candidateId: values.candidateId,
    missionId: values.missionId || null,
    devisId: devisId || undefined,
    kind: values.kind,
    hours: values.hours === '' ? null : Number(values.hours),
    hourlyRate: values.hourlyRate === '' ? null : Number(values.hourlyRate),
    amountHt: Number(values.amountHt),
    htSource: values.htSource,
  })
}
