'use client'

import { useMemo, useState } from 'react'
import { toCandidateListRows } from '@/view-models/candidate-list'
import { AnimatePresence, motion } from 'framer-motion'
import { Users } from 'lucide-react'
import { CandidatTabs, type CandidatsTab } from '@/components/molecules/CandidatTabs'
import { DashboardPage } from '@/components/molecules/DashboardPage'
import { SectionCard } from '@/components/molecules/SectionCard'
import { ApplicationInbox } from '@/components/molecules/ApplicationInbox'
import { CvthequeSection } from '@/components/organisms/CvthequeSection'
import { tabPanelMotion } from '@/lib/motion/variants'
import type { CandidateListRow } from '@/view-models/candidate-list'
import type { RawCandidate, RawStage } from '@/view-models/candidate-kanban.types'
import type { InboxItem } from '@/view-models/application-inbox'

type Props = {
  list: { rows: RawCandidate[]; stages: RawStage[] }
  inbox: InboxItem[]
}

export function CandidatsPage({ list, inbox }: Props) {
  const [tab, setTab] = useState<CandidatsTab>('cvtheque')
  const listRows = useMemo(() => toCandidateListRows(list.rows), [list.rows])
  const description = useMemo(
    () =>
      `${listRows.length} profil(s) en CVthèque · ${inbox.length} candidature(s) en attente`,
    [listRows.length, inbox.length],
  )

  return (
    <DashboardPage
      icon={<Users className="size-5" />}
      title="Candidats"
      description={description}
      nav={<CandidatTabs active={tab} onChange={setTab} inboxCount={inbox.length} />}
    >
      <AnimatePresence mode="wait">
        <motion.div key={tab} className="w-full" {...tabPanelMotion}>
          {tab === 'cvtheque' ? (
            <CvthequeSection rows={listRows} candidates={list.rows} stages={list.stages} />
          ) : (
            <SectionCard
              variant="glass"
              title="Candidatures reçues"
              description="Flux entrant Webflow — validez ou refusez avant intégration à la CVthèque."
              bodyClassName="p-4 sm:p-5"
            >
              <ApplicationInbox items={inbox} />
            </SectionCard>
          )}
        </motion.div>
      </AnimatePresence>
    </DashboardPage>
  )
}
