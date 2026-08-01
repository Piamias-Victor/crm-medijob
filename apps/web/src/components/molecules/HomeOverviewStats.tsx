'use client'

import { motion } from 'framer-motion'
import { HomeStatTile } from '@/components/molecules/HomeStatTile'
import { listContainer, listItem } from '@/lib/motion/variants'
import { buildHomeKpis } from '@/view-models/home-kpi'
import type { DashboardOverview } from '@/view-models/home-overview'

type Props = { overview: DashboardOverview }

export function HomeOverviewStats({ overview }: Props) {
  const kpis = buildHomeKpis(overview)

  return (
    <motion.div
      variants={listContainer}
      initial="hidden"
      animate="visible"
      className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      {kpis.map((mod, index) => (
        <motion.div key={mod.label} custom={index} variants={listItem} className="h-full">
          <HomeStatTile mod={mod} />
        </motion.div>
      ))}
    </motion.div>
  )
}
