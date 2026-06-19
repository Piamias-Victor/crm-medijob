'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ActivityType } from '@prisma/client'
import { trpc } from '@/lib/trpc/client'
import type { ActivityLogRow } from '@/view-models/activity-log-list'
import { ACTIVITY_TYPE_OPTIONS } from '@/lib/activity-log-options'
import { ActivityLogFilters } from '@/components/molecules/ActivityLogFilters'
import { ActivityLogTimeline } from '@/components/molecules/ActivityLogTimeline'
import { ActivityLogCreateForm } from '@/components/molecules/ActivityLogCreateForm'
import { FormSection } from '@/components/molecules/FormSection'

type Scope = { contactId: string } | { pharmacyId: string }

type Props = {
  scope: Scope
  initialLogs: ActivityLogRow[]
}

export function ActivityLogTab({ scope, initialLogs }: Props) {
  const router = useRouter()
  const utils = trpc.useUtils()
  const [types, setTypes] = useState<string[]>([])
  const listInput = {
    ...scope,
    ...(types.length ? { types: types as ActivityType[] } : {}),
  }
  const { data: logs = initialLogs } = trpc.activityLog.list.useQuery(listInput, { initialData: initialLogs })
  const create = trpc.activityLog.create.useMutation({
    onSuccess: async () => {
      await utils.activityLog.list.invalidate()
      router.refresh()
    },
  })

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-fg">Filtrer par type</p>
        <ActivityLogFilters options={ACTIVITY_TYPE_OPTIONS} values={types} onChange={setTypes} />
      </div>
      <ActivityLogTimeline logs={logs} />
      <FormSection title="Ajouter une entrée">
        <ActivityLogCreateForm
          submitting={create.isPending}
          onSubmit={(data) => create.mutate({ ...scope, ...data })}
        />
      </FormSection>
    </div>
  )
}
