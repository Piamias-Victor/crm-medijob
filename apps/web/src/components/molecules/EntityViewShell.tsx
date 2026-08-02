'use client'

import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SectionCard } from '@/components/molecules/SectionCard'
import {
  ViewToggle,
  type ViewToggleItem,
} from '@/components/molecules/ViewToggle'
import { tabPanelMotion } from '@/lib/motion/variants'

export type EntityViewPanel = {
  title: string
  description: string
  content: ReactNode
}

type Props<TView extends string> = {
  view: TView
  onViewChange: (view: TView) => void
  viewOptions: ViewToggleItem<TView>[]
  panels: Record<TView, EntityViewPanel>
}

export function EntityViewShell<TView extends string>({
  view,
  onViewChange,
  viewOptions,
  panels,
}: Props<TView>) {
  const panel = panels[view]

  return (
    <SectionCard
      variant="glass"
      title={panel.title}
      description={panel.description}
      actions={<ViewToggle view={view} onChange={onViewChange} items={viewOptions} />}
      bodyClassName="p-4 sm:p-5"
    >
      <AnimatePresence mode="wait">
        <motion.div key={view} {...tabPanelMotion}>
          {panel.content}
        </motion.div>
      </AnimatePresence>
    </SectionCard>
  )
}
