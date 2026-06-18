'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ViewToggle, type CvView } from '@/components/molecules/ViewToggle'
import { SectionCard } from '@/components/molecules/SectionCard'
import { CvthequeList } from '@/components/organisms/CvthequeList'
import { CvthequeKanban } from '@/components/organisms/CvthequeKanban'
import { tabPanelMotion } from '@/lib/motion/variants'
import type { RawCandidate, RawStage } from '@/view-models/candidate-kanban'

type Props = { candidates: RawCandidate[]; stages: RawStage[] }

export function CvthequeSection({ candidates, stages }: Props) {
  const [view, setView] = useState<CvView>('list')
  const description = useMemo(
    () =>
      view === 'list'
        ? 'Parcourez tous les profils de la CVthèque.'
        : 'Suivez la progression par mission et étape de pipeline.',
    [view],
  )

  return (
    <SectionCard
      variant="glass"
      title="CVthèque"
      description={description}
      actions={<ViewToggle view={view} onChange={setView} />}
      bodyClassName="p-4 sm:p-5"
    >
      <AnimatePresence mode="wait">
        <motion.div key={view} {...tabPanelMotion}>
          {view === 'list' ? (
            <CvthequeList candidates={candidates} />
          ) : (
            <CvthequeKanban candidates={candidates} stages={stages} />
          )}
        </motion.div>
      </AnimatePresence>
    </SectionCard>
  )
}
