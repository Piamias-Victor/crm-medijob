'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { EmptyState } from '@/components/atoms/EmptyState'
import { Spinner } from '@/components/atoms/Spinner'
import { MissionMatchingLaunchPanel } from '@/components/molecules/MissionMatchingLaunchPanel'
import { MissionMatchingResults } from '@/components/molecules/MissionMatchingResults'
import { tabPanelMotion } from '@/lib/motion/variants'
import type { MissionMatchingPayload } from '@/view-models/mission-matching.types'

type Props = {
  missionId: string
  jobTitleName: string
  pharmacyName: string
  canMatch: boolean
}

export function BadakanMissionMatchingTab({
  missionId,
  jobTitleName,
  pharmacyName,
  canMatch,
}: Props) {
  const [result, setResult] = useState<MissionMatchingPayload | null>(null)
  const [recentProposed, setRecentProposed] = useState<string[]>([])
  const proposals = trpc.badakanProposal.listByMission.useQuery({ missionId })
  const matching = trpc.matching.scoreBadakanMissionCandidates.useMutation({ onSuccess: setResult })
  const proposedIds = useMemo(() => {
    const fromDb = (proposals.data ?? []).map((row) => row.candidateId)
    return [...new Set([...fromDb, ...recentProposed])]
  }, [proposals.data, recentProposed])

  if (!canMatch) {
    return (
      <EmptyState
        icon={Sparkles}
        title="Métier non résolu"
        description="Rattache l’activité Badakan à un métier CRM."
      />
    )
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
          <p className="text-sm font-medium text-fg-muted">Pré-filtre + scoring…</p>
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
              missionTitle={`${jobTitleName} — ${pharmacyName}`}
              pharmacyName={pharmacyName}
              positionedIds={[]}
              proposedIds={proposedIds}
              pipelineLocked
              onPositioned={() => undefined}
              onProposed={(id) => {
                setRecentProposed((ids) => [...ids, id])
                void proposals.refetch()
              }}
              scored={result.scored}
              excluded={result.excluded}
              eligibleCount={result.eligibleCount}
              excludedCount={result.excludedCount}
            />
          </motion.div>
        ) : null}
        {!result && !matching.isPending ? (
          <motion.div key="idle" {...tabPanelMotion}>
            <EmptyState
              icon={Sparkles}
              title="Matcher les candidats dispos"
              description="Pré-filtre dates mission, puis scoring IA."
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
