'use client'

import { Send } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { trpc } from '@/lib/trpc/client'
import { useToastStore } from '@/stores/toast-store'
import { WEEKLY_AVAILABILITY_COPY } from '@/view-models/weekly-availability-copy'

type Props = { candidateId: string }

export function ResendWeeklyAvailabilitySmsButton({ candidateId }: Props) {
  const push = useToastStore((s) => s.push)
  const resend = trpc.weeklyAvailability.resendSms.useMutation()

  return (
    <Button
      type="button"
      variant="outline"
      disabled={resend.isPending}
      onClick={async () => {
        try {
          const result = await resend.mutateAsync({ id: candidateId })
          if (!result?.sent) {
            push({ variant: 'error', message: WEEKLY_AVAILABILITY_COPY.resendNoPhone })
            return
          }
          push({ variant: 'success', message: WEEKLY_AVAILABILITY_COPY.resent })
        } catch {
          push({ variant: 'error', message: WEEKLY_AVAILABILITY_COPY.resendError })
        }
      }}
    >
      <Send className="size-4" />
      {WEEKLY_AVAILABILITY_COPY.resendSms}
    </Button>
  )
}
