'use client'

import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useToastStore } from '@/stores/toast-store'
import type { ActivityLogScope } from '@/view-models/activity-log.types'
import { ACTIVITY_LOG_SUCCESS } from '@/components/molecules/email-button/email-button-copy'
import { activityLogErrorMessage } from '@/components/molecules/email-button/activity-log-error-message'

export function useActivityLogEmailSave(scopes: ActivityLogScope[], onSaved: () => void) {
  const router = useRouter()
  const utils = trpc.useUtils()
  const push = useToastStore((state) => state.push)
  const batch = trpc.activityLog.createBatch.useMutation()

  async function save(content: string | undefined) {
    const date = new Date()
    const payload = content?.trim() || undefined
    await batch.mutateAsync({
      entries: scopes.map((scope) => ({ ...scope, type: 'EMAIL', content: payload, date })),
    })
    await Promise.all(scopes.map((scope) => utils.activityLog.listByEntity.invalidate(scope)))
    router.refresh()
    push({ variant: 'success', message: ACTIVITY_LOG_SUCCESS })
    onSaved()
  }

  async function saveOrToastError(content: string | undefined) {
    try {
      await save(content)
    } catch (error) {
      push({ variant: 'error', message: activityLogErrorMessage(error) })
      throw error
    }
  }

  return { saveOrToastError, isPending: batch.isPending }
}
