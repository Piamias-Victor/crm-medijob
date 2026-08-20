'use client'

import { motion } from 'framer-motion'
import { HomeStatTile } from '@/components/molecules/HomeStatTile'
import { listContainer, listItem } from '@/lib/motion/variants'
import type { HomeKpiDef } from '@/view-models/home-kpi'

type Props = { items: HomeKpiDef[] }

export function StatTiles({ items }: Props) {
  return (
    <motion.div
      variants={listContainer}
      initial="hidden"
      animate="visible"
      className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      {items.map((mod, index) => (
        <motion.div key={mod.label} custom={index} variants={listItem} className="h-full">
          <HomeStatTile mod={mod} />
        </motion.div>
      ))}
    </motion.div>
  )
}
