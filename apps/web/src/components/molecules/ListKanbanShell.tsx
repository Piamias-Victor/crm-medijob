'use client'

import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SectionCard } from '@/components/molecules/SectionCard'
import {
  ViewToggle,
  type ViewToggleItem,
} from '@/components/molecules/ViewToggle'
import { tabPanelMotion } from '@/lib/motion/variants'

type Props<TView extends string> = {
  view: TView
  primaryView: TView
  onViewChange: (view: TView) => void
  viewOptions: ViewToggleItem<TView>[]
  listTitle: string
  kanbanTitle: string
  listDescription: string
  kanbanDescription: string
  listView: ReactNode
  kanbanView: ReactNode
}

export function ListKanbanShell<TView extends string>({
  view,
  primaryView,
  onViewChange,
  viewOptions,
  listTitle,
  kanbanTitle,
  listDescription,
  kanbanDescription,
  listView,
  kanbanView,
}: Props<TView>) {
  const isPrimary = view === primaryView

  return (
    <SectionCard
      variant="glass"
      title={isPrimary ? listTitle : kanbanTitle}
      description={isPrimary ? listDescription : kanbanDescription}
      actions={<ViewToggle view={view} onChange={onViewChange} items={viewOptions} />}
      bodyClassName="p-4 sm:p-5"
    >
      <AnimatePresence mode="wait">
        <motion.div key={view} {...tabPanelMotion}>
          {isPrimary ? listView : kanbanView}
        </motion.div>
      </AnimatePresence>
    </SectionCard>
  )
}
