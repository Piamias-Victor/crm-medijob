'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { SoftDeleteModal } from '@/components/molecules/soft-delete-modal/soft-delete-modal'
import { useCan } from '@/lib/hooks/use-can'
import { trpc } from '@/lib/trpc/client'
import { useToastStore } from '@/stores/toast-store'

type Props = { candidateId: string; candidateName: string }

export function CandidateGdprEraseButton({ candidateId, candidateName }: Props) {
  const canErase = useCan('gdpr.erase')
  const router = useRouter()
  const push = useToastStore((s) => s.push)
  const [open, setOpen] = useState(false)
  const erase = trpc.candidate.gdprErase.useMutation({
    onSuccess: () => {
      push({ variant: 'success', message: 'Effacement RGPD effectué' })
      router.push('/candidats')
      router.refresh()
    },
  })

  if (!canErase) return null

  return (
    <>
      <Button
        type="button"
        variant="danger"
        className="px-4 py-2 text-sm font-semibold"
        onClick={() => setOpen(true)}
      >
        Effacement RGPD
      </Button>
      <SoftDeleteModal
        entityName={`${candidateName} (RGPD définitif)`}
        open={open}
        onOpenChange={setOpen}
        onConfirm={async () => {
          await erase.mutateAsync({ id: candidateId, reason: 'droit à l’oubli' })
        }}
      />
    </>
  )
}
