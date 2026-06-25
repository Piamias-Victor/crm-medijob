'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Ban } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { isTerminalMissionStatus } from '@/lib/kanban-terminal'
import type { MissionDetailPayload } from '@/view-models/mission-detail.types'
import { Button } from '@/components/atoms/Button'
import { SoftDeleteModal } from '@/components/molecules/soft-delete-modal/soft-delete-modal'

type Props = { mission: MissionDetailPayload }

export function MissionStatusActions({ mission }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const mutation = useEntityMutation({
    onSuccess: () => {
      setOpen(false)
      router.refresh()
    },
    successMessage: 'Mission annulée',
  })
  const markAnnulee = trpc.mission.markAnnulee.useMutation({ onSuccess: mutation.onSuccess })

  if (isTerminalMissionStatus(mission.status)) return null

  return (
    <>
      <div className="flex flex-col gap-3 rounded-xl border border-error/25 bg-error/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-error/10 text-error">
            <Ban className="size-4" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-fg">Besoin abandonné</p>
            <p className="text-xs leading-relaxed text-fg-muted">
              Retire la mission du kanban actif et passe les candidats en « Pas retenu ».
            </p>
          </div>
        </div>
        <Button
          variant="danger"
          className="shrink-0 px-3 py-2 text-xs sm:text-sm"
          disabled={markAnnulee.isPending}
          onClick={() => setOpen(true)}
        >
          Annuler la mission
        </Button>
      </div>
      <SoftDeleteModal
        entityName={mission.formSource.title}
        open={open}
        onOpenChange={setOpen}
        onConfirm={async () => {
          await markAnnulee.mutateAsync({ id: mission.id })
        }}
      />
    </>
  )
}
