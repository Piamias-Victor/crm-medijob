'use client'

import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { pharmacyInputSchema, type PharmacyInput } from '@/view-models/pharmacy-form.schema'

export function usePharmacyCreateForm(
  defaultValues: PharmacyInput,
): UseFormReturn<PharmacyInput> {
  return useForm<PharmacyInput>({
    resolver: zodResolver(pharmacyInputSchema),
    defaultValues,
  })
}
