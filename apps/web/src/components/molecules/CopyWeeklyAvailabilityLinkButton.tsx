'use client'

import { Link2 } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { trpc } from '@/lib/trpc/client'
import { useToastStore } from '@/stores/toast-store'
import { WEEKLY_AVAILABILITY_COPY } from '@/view-models/weekly-availability-copy'

type Props = { candidateId: string }

export function CopyWeeklyAvailabilityLinkButton({ candidateId }: Props) {
  const push = useToastStore((s) => s.push)
  const copy = trpc.weeklyAvailability.copyLink.useMutation()

  return (
    <Button
      type="button"
      variant="outline"
      disabled={copy.isPending}
      onClick={async () => {
        try {
          const result = await copy.mutateAsync({ id: candidateId })
          if (!result) return
          await navigator.clipboard.writeText(result.url)
          push({ variant: 'success', message: WEEKLY_AVAILABILITY_COPY.copied })
        } catch {
          push({ variant: 'error', message: WEEKLY_AVAILABILITY_COPY.copyError })
        }
      }}
    >
      <Link2 className="size-4" />
      {WEEKLY_AVAILABILITY_COPY.copyLink}
    </Button>
  )
}
