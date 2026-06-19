'use client'

import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { isTerminalMissionStatus } from '@/lib/kanban-terminal'
import type { MissionDetailPayload } from '@/view-models/mission-detail.types'
import { Button } from '@/components/atoms/Button'

type Props = { mission: MissionDetailPayload }

export function MissionStatusActions({ mission }: Props) {
  const router = useRouter()
  const markAnnulee = trpc.mission.markAnnulee.useMutation({ onSuccess: () => router.refresh() })

  if (isTerminalMissionStatus(mission.status)) return null

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border/55 bg-white/70 p-4">
      <div>
        <p className="text-sm font-medium text-fg">Annuler le besoin</p>
        <p className="mt-1 text-xs leading-relaxed text-fg-muted">
          Si la pharmacie abandonne le recrutement. La mission sort du kanban actif et tous les
          candidats passent en « Pas retenu ». Le statut « Pourvu » se déclenche depuis le pipeline
          candidats (#66), pas ici.
        </p>
      </div>
      <Button
        variant="ghost"
        disabled={markAnnulee.isPending}
        onClick={() => markAnnulee.mutate({ id: mission.id })}
      >
        {markAnnulee.isPending ? 'Annulation…' : 'Annuler la mission'}
      </Button>
    </div>
  )
}
