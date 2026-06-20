'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import type { MissionStatus } from '@prisma/client'
import { trpc } from '@/lib/trpc/client'
import { isTerminalMissionStatus } from '@/lib/kanban-terminal'
import { EmptyState } from '@/components/atoms/EmptyState'
import { Spinner } from '@/components/atoms/Spinner'
import { MissionMatchingLaunchPanel } from '@/components/molecules/MissionMatchingLaunchPanel'
import { MissionMatchingResults } from '@/components/molecules/MissionMatchingResults'
import { tabPanelMotion } from '@/lib/motion/variants'
import type { MissionMatchingPayload } from '@/view-models/mission-matching'

type Props = {
  missionId: string
  missionStatus: MissionStatus
  jobTitleName: string
  pharmacyName: string
  positionedIds: string[]
}

export function MissionMatchingTab({
  missionId,
  missionStatus,
  jobTitleName,
  pharmacyName,
  positionedIds,
}: Props) {
  const router = useRouter()
  const [result, setResult] = useState<MissionMatchingPayload | null>(null)
  const [recentlyPositioned, setRecentlyPositioned] = useState<string[]>([])
  const matching = trpc.matching.scoreMissionCandidates.useMutation({ onSuccess: setResult })
  const pipelineLocked = isTerminalMissionStatus(missionStatus)
  const knownPositioned = useMemo(
    () => [...new Set([...positionedIds, ...recentlyPositioned])],
    [positionedIds, recentlyPositioned],
  )

  const handlePositioned = (candidateId: string) => {
    setRecentlyPositioned((prev) => (prev.includes(candidateId) ? prev : [...prev, candidateId]))
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-6">
      <MissionMatchingLaunchPanel
        jobTitleName={jobTitleName}
        pharmacyName={pharmacyName}
        pending={matching.isPending}
        onLaunch={() => matching.mutate({ missionId })}
      />

      {matching.isPending ? (
        <div className="flex items-center justify-center gap-3 rounded-2xl border border-dashed border-accent/30 bg-accent-muted/15 py-12">
          <Spinner className="size-5 border-accent/30 border-t-accent" />
          <p className="text-sm font-medium text-fg-muted">Pré-filtre et scoring en cours…</p>
        </div>
      ) : null}

      {matching.error ? (
        <p className="rounded-xl border border-error/25 bg-error/5 px-4 py-3 text-sm text-error">
          {matching.error.message}
        </p>
      ) : null}

      <AnimatePresence mode="wait">
        {result && !matching.isPending ? (
          <motion.div key="results" {...tabPanelMotion}>
            <MissionMatchingResults
              missionId={missionId}
              positionedIds={knownPositioned}
              pipelineLocked={pipelineLocked}
              onPositioned={handlePositioned}
              scored={result.scored}
              excluded={result.excluded}
            />
          </motion.div>
        ) : null}
        {!result && !matching.isPending ? (
          <motion.div key="idle" {...tabPanelMotion}>
            <EmptyState
              icon={Sparkles}
              title="Prêt à analyser la CVthèque"
              description="Lancez l’analyse pour obtenir un classement IA des candidats compatibles avec cette mission."
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
