'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { trpc } from '@/lib/trpc/client'
import { useToastStore } from '@/stores/toast-store'
import { openDevisSendResult } from '@/lib/finance/open-devis-send-result'
import {
  financeLineFormSchema,
  defaultFinanceLineFormValues,
  toCreateFinanceLineInput,
  type FinanceLineFormValues,
} from '@/view-models/finance-line-form'
import { FINANCE_LINE_MISSION_REQUIRED } from '@/view-models/finance-line-copy'
import { filterMissionsForPharmacy } from '@/view-models/filter-missions-for-pharmacy'
import { financeLineActionToast } from '@/view-models/finance-line-action-toast'
import type { FacturationMissionOption } from '@/view-models/finance-line'

export type FinanceLineSubmitAction = 'save' | 'generate' | 'send'

export function useFinanceLineForm(missions: FacturationMissionOption[], onDone?: () => void) {
  const router = useRouter()
  const utils = trpc.useUtils()
  const push = useToastStore((s) => s.push)
  const form = useForm<FinanceLineFormValues>({
    resolver: zodResolver(financeLineFormSchema),
    defaultValues: defaultFinanceLineFormValues(),
  })
  const create = trpc.facturation.createLine.useMutation()
  const generate = trpc.facturation.generateDevisFromLine.useMutation()
  const send = trpc.devis.send.useMutation()
  const pharmacyId = form.watch('pharmacyId')
  const missionId = form.watch('missionId')
  const busy = create.isPending || generate.isPending || send.isPending

  const finish = (action: FinanceLineSubmitAction) => {
    push({ variant: 'success', message: financeLineActionToast[action] })
    void utils.facturation.listSuivi.invalidate()
    void utils.facturation.overview.invalidate()
    router.refresh()
    onDone?.()
  }

  const run = async (values: FinanceLineFormValues, action: FinanceLineSubmitAction) => {
    const line = await create.mutateAsync(toCreateFinanceLineInput(values))
    if (action === 'save') return finish('save')
    if (!line.missionId) {
      push({ variant: 'error', message: FINANCE_LINE_MISSION_REQUIRED })
      void utils.facturation.listSuivi.invalidate()
      router.refresh()
      onDone?.()
      return
    }
    const generated = await generate.mutateAsync({ id: line.id })
    if (action === 'generate') return finish('generate')
    openDevisSendResult(await send.mutateAsync({ missionId: generated.missionId }))
    finish('send')
  }

  return {
    form,
    busy,
    hasMission: Boolean(missionId),
    missionOptions: filterMissionsForPharmacy(missions, pharmacyId),
    submit: (action: FinanceLineSubmitAction) =>
      form.handleSubmit((values) => {
        void run(values, action).catch((error: { message?: string }) => {
          push({ variant: 'error', message: error.message ?? 'Erreur' })
        })
      })(),
  }
}
