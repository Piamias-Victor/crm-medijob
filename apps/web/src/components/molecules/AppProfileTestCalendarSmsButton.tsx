'use client'

import { Button } from '@/components/atoms/Button'
import { trpc } from '@/lib/trpc/client'
import { useToastStore } from '@/stores/toast-store'
import { calendarSmsTestMessage } from '@/view-models/hireflix-calendar-sms-test-report'

export function AppProfileTestCalendarSmsButton() {
  const push = useToastStore((s) => s.push)
  const run = trpc.appProfile.testCalendarSms.useMutation({
    onSuccess: (report) =>
      push({
        variant: report.ok ? 'success' : 'error',
        message: calendarSmsTestMessage(report),
      }),
    onError: (error) => push({ variant: 'error', message: error.message }),
  })

  return (
    <Button
      type="button"
      variant="outline"
      disabled={run.isPending}
      onClick={() => run.mutate()}
    >
      {run.isPending ? 'Envoi…' : 'Tester SMS RDV'}
    </Button>
  )
}
