'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { EmptyState } from '@/components/atoms/EmptyState'
import { Spinner } from '@/components/atoms/Spinner'
import { MissionMatchingResults } from '@/components/molecules/MissionMatchingResults'
import { tabPanelMotion } from '@/lib/motion/variants'
import type { MissionMatchingPayload } from '@/view-models/mission-matching'

type Props = {
  pending: boolean
  errorMessage?: string
  result: MissionMatchingPayload | null
  missionId: string
  missionTitle: string
  pharmacyName: string
  positionedIds: string[]
  pipelineLocked: boolean
  onPositioned: (candidateId: string) => void
}

export function MissionMatchingTabBody({
  pending,
  errorMessage,
  result,
  missionId,
  missionTitle,
  pharmacyName,
  positionedIds,
  pipelineLocked,
  onPositioned,
}: Props) {
  return (
    <>
      {pending ? (
        <div className="flex items-center justify-center gap-3 rounded-2xl border border-dashed border-accent/30 bg-accent-muted/15 py-12">
          <Spinner className="size-5 border-accent/30 border-t-accent" />
          <p className="text-sm font-medium text-fg-muted">Pré-filtre et scoring en cours…</p>
        </div>
      ) : null}
      {errorMessage ? (
        <p className="rounded-xl border border-error/25 bg-error/5 px-4 py-3 text-sm text-error">
          {errorMessage}
        </p>
      ) : null}
      <AnimatePresence mode="wait">
        {result && !pending ? (
          <motion.div key="results" {...tabPanelMotion}>
            <MissionMatchingResults
              missionId={missionId}
              missionTitle={missionTitle}
              pharmacyName={pharmacyName}
              positionedIds={positionedIds}
              pipelineLocked={pipelineLocked}
              onPositioned={onPositioned}
              scored={result.scored}
              excluded={result.excluded}
              eligibleCount={result.eligibleCount}
              excludedCount={result.excludedCount}
            />
          </motion.div>
        ) : null}
        {!result && !pending ? (
          <motion.div key="idle" {...tabPanelMotion}>
            <EmptyState
              icon={Sparkles}
              title="Prêt à analyser la CVthèque"
              description="Lancez l’analyse pour obtenir un classement IA des candidats compatibles avec cette mission."
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
