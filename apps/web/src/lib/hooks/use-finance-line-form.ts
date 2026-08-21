'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import {
  financeLineFormSchema,
  defaultFinanceLineFormValues,
  toCreateFinanceLineInput,
  type FinanceLineFormValues,
} from '@/view-models/finance-line-form'
import { FINANCE_LINE_CREATED } from '@/view-models/finance-line-copy'
import { filterMissionsForPharmacy } from '@/view-models/filter-missions-for-pharmacy'
import type { FacturationMissionOption } from '@/view-models/finance-line'

export function useFinanceLineForm(missions: FacturationMissionOption[]) {
  const router = useRouter()
  const toast = useEntityMutation({
    successMessage: FINANCE_LINE_CREATED,
    onSuccess: () => {
      router.push('/facturation/suivi')
      router.refresh()
    },
  })
  const form = useForm<FinanceLineFormValues>({
    resolver: zodResolver(financeLineFormSchema),
    defaultValues: defaultFinanceLineFormValues(),
  })
  const create = trpc.facturation.createLine.useMutation({
    onSuccess: toast.onSuccess,
    onError: toast.onError,
  })
  const pharmacyId = form.watch('pharmacyId')

  return {
    form,
    submitting: create.isPending,
    onSubmit: form.handleSubmit((values) => create.mutate(toCreateFinanceLineInput(values))),
    missionOptions: filterMissionsForPharmacy(missions, pharmacyId),
  }
}
