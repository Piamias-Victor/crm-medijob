'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { trpc } from '@/lib/trpc/client'
import { useToastStore } from '@/stores/toast-store'
import {
  financeLineFormSchema,
  defaultFinanceLineFormValues,
  toCreateFinanceLineInput,
  type FinanceLineFormValues,
} from '@/view-models/finance-line-form'
import { filterMissionsForPharmacy } from '@/view-models/filter-missions-for-pharmacy'
import { financeLineActionToast } from '@/view-models/finance-line-action-toast'
import { invalidateFacturationQueries } from '@/lib/hooks/invalidate-facturation-queries'
import type { useFinanceLineDevisPreview } from '@/lib/hooks/use-finance-line-devis-preview'
import type { FacturationMissionOption, FinanceLineKind } from '@/view-models/finance-line'

export type FinanceLineSubmitAction = 'save' | 'generate'

type Preview = ReturnType<typeof useFinanceLineDevisPreview>

export function useFinanceLineForm(
  missions: FacturationMissionOption[],
  preview: Preview,
  onDone?: () => void,
  defaultKind: FinanceLineKind = 'PLACEMENT',
) {
  const router = useRouter()
  const utils = trpc.useUtils()
  const push = useToastStore((s) => s.push)
  const form = useForm<FinanceLineFormValues>({
    resolver: zodResolver(financeLineFormSchema),
    defaultValues: defaultFinanceLineFormValues(defaultKind),
  })
  const create = trpc.facturation.createLine.useMutation()
  const pharmacyId = form.watch('pharmacyId')
  const busy = create.isPending || preview.previewing || preview.saving || preview.sending

  const finish = () => {
    push({ variant: 'success', message: financeLineActionToast.save })
    invalidateFacturationQueries(utils)
    router.refresh()
    onDone?.()
  }

  const run = async (values: FinanceLineFormValues, action: FinanceLineSubmitAction) => {
    if (action === 'generate') {
      await preview.openPreview(values)
      return
    }
    await create.mutateAsync(toCreateFinanceLineInput(values, preview.devisId))
    finish()
  }

  return {
    form,
    busy,
    missionOptions: filterMissionsForPharmacy(missions, pharmacyId),
    submit: (action: FinanceLineSubmitAction) =>
      form.handleSubmit((values) => {
        void run(values, action).catch((error: { message?: string }) => {
          push({ variant: 'error', message: error.message ?? 'Erreur' })
        })
      })(),
  }
}
