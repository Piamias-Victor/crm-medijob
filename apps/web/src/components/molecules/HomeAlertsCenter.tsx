'use client'

import { motion } from 'framer-motion'
import { HomeAlertGroup } from '@/components/molecules/HomeAlertGroup'
import { listContainer, listItem } from '@/lib/motion/variants'
import { buildHomeAlertGroups } from '@/view-models/home-alerts'
import type { DashboardOverview } from '@/view-models/home-overview'

type Props = { overview: DashboardOverview }

export function HomeAlertsCenter({ overview }: Props) {
  const groups = buildHomeAlertGroups(overview)

  return (
    <motion.div
      variants={listContainer}
      initial="hidden"
      animate="visible"
      className="grid gap-3 md:grid-cols-3"
    >
      {groups.map((group, index) => (
        <motion.div key={group.key} custom={index} variants={listItem}>
          <HomeAlertGroup group={group} />
        </motion.div>
      ))}
    </motion.div>
  )
}
