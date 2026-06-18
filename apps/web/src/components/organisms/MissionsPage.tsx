'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Briefcase } from 'lucide-react'
import { DashboardPage } from '@/components/molecules/DashboardPage'
import { SectionCard } from '@/components/molecules/SectionCard'
import { ViewToggle, type CvView } from '@/components/molecules/ViewToggle'
import { MissionList } from '@/components/organisms/MissionList'
import { MissionKanban } from '@/components/organisms/MissionKanban'
import { tabPanelMotion } from '@/lib/motion/variants'
import type { RawMission } from '@/view-models/mission-kanban'

type Props = { missions: RawMission[] }

export function MissionsPage({ missions }: Props) {
  const [view, setView] = useState<CvView>('list')
  const description = useMemo(
    () => `${missions.length} mission(s) — liste complète ou kanban par statut.`,
    [missions.length],
  )
  const sectionDescription = useMemo(
    () =>
      view === 'list'
        ? 'Toutes les missions, y compris pourvues et annulées.'
        : 'Glissez une carte pour changer le statut.',
    [view],
  )

  return (
    <DashboardPage icon={<Briefcase className="size-5" />} title="Missions" description={description}>
      <SectionCard
        variant="glass"
        title={view === 'list' ? 'Toutes les missions' : 'Pipeline missions'}
        description={sectionDescription}
        actions={<ViewToggle view={view} onChange={setView} />}
        bodyClassName="p-4 sm:p-5"
      >
        <AnimatePresence mode="wait">
          <motion.div key={view} {...tabPanelMotion}>
            {view === 'list' ? <MissionList missions={missions} /> : <MissionKanban missions={missions} />}
          </motion.div>
        </AnimatePresence>
      </SectionCard>
    </DashboardPage>
  )
}
