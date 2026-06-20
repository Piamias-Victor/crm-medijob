'use client'

import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SectionCard } from '@/components/molecules/SectionCard'
import { ViewToggle, type CvView } from '@/components/molecules/ViewToggle'
import { tabPanelMotion } from '@/lib/motion/variants'

type Props = {
  view: CvView
  onViewChange: (view: CvView) => void
  listTitle: string
  kanbanTitle: string
  listDescription: string
  kanbanDescription: string
  listView: ReactNode
  kanbanView: ReactNode
}

export function ListKanbanShell({
  view,
  onViewChange,
  listTitle,
  kanbanTitle,
  listDescription,
  kanbanDescription,
  listView,
  kanbanView,
}: Props) {
  return (
    <SectionCard
      variant="glass"
      title={view === 'list' ? listTitle : kanbanTitle}
      description={view === 'list' ? listDescription : kanbanDescription}
      actions={<ViewToggle view={view} onChange={onViewChange} />}
      bodyClassName="p-4 sm:p-5"
    >
      <AnimatePresence mode="wait">
        <motion.div key={view} {...tabPanelMotion}>
          {view === 'list' ? listView : kanbanView}
        </motion.div>
      </AnimatePresence>
    </SectionCard>
  )
}
