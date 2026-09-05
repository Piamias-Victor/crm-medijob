'use client'

import { Button } from '@/components/atoms/Button'
import { trpc } from '@/lib/trpc/client'
import { useToastStore } from '@/stores/toast-store'
import { testProcessMessage } from '@/view-models/app-profile-test-report'

type Props = { profileId: string }

export function AppProfileTestProcessButton({ profileId }: Props) {
  const push = useToastStore((s) => s.push)
  const run = trpc.appProfile.testProcess.useMutation({
    onSuccess: (report) =>
      push({
        variant: report.ok ? 'success' : 'error',
        message: testProcessMessage(report),
      }),
    onError: (error) => push({ variant: 'error', message: error.message }),
  })

  return (
    <Button
      type="button"
      variant="outline"
      disabled={run.isPending}
      onClick={() => run.mutate({ id: profileId })}
    >
      {run.isPending ? 'Test en cours…' : 'Tester le process (SMS de test)'}
    </Button>
  )
}
