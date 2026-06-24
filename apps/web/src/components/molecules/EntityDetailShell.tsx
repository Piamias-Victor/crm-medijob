'use client'

import { type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { pageEntrance, tabPanelMotion } from '@/lib/motion/variants'

type Props = {
  header: ReactNode
  meta?: ReactNode
  tabs?: ReactNode
  tabKey: string
  children: ReactNode
}

export function EntityDetailShell({ header, meta, tabs, tabKey, children }: Props) {
  return (
    <motion.div
      variants={pageEntrance}
      initial="hidden"
      animate="visible"
      className="mx-auto flex w-full max-w-[88rem] flex-col gap-6"
    >
      {header}
      {meta}
      {tabs ?? null}
      <AnimatePresence mode="wait">
        <motion.div key={tabKey} className="w-full" {...tabPanelMotion}>
          {children}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
