'use client'

import { motion } from 'framer-motion'
import { HomeActionTile } from '@/components/molecules/HomeActionTile'
import { listContainer, listItem } from '@/lib/motion/variants'
import type { HomeActionDef } from '@/view-models/home-modules'
import type { HomeQuickCreateKind } from '@/view-models/home-referentials'

type Props = {
  actions: HomeActionDef[]
  onOpen: (kind: HomeQuickCreateKind) => void
}

export function HomeQuickActions({ actions, onOpen }: Props) {
  return (
    <motion.div
      variants={listContainer}
      initial="hidden"
      animate="visible"
      className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      {actions.map((action, index) => (
        <motion.div key={action.kind} custom={index} variants={listItem} className="h-full">
          <HomeActionTile action={action} onOpen={onOpen} />
        </motion.div>
      ))}
    </motion.div>
  )
}
