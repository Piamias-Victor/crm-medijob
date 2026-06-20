'use client'

import { motion } from 'framer-motion'
import { HomeStatTile } from '@/components/molecules/HomeStatTile'
import { listContainer, listItem } from '@/lib/motion/variants'
import { buildHomeModules } from '@/view-models/home-modules'
import type { DashboardOverview } from '@/view-models/home-overview'

type Props = { overview: DashboardOverview }

export function HomeOverviewStats({ overview }: Props) {
  const modules = buildHomeModules(overview)

  return (
    <motion.div
      variants={listContainer}
      initial="hidden"
      animate="visible"
      className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      {modules.map((mod, index) => (
        <motion.div key={mod.label} custom={index} variants={listItem} className="h-full">
          <HomeStatTile mod={mod} />
        </motion.div>
      ))}
    </motion.div>
  )
}
