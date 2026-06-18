'use client'

import { motion } from 'framer-motion'
import { Briefcase } from 'lucide-react'
import { EmptyState } from '@/components/atoms/EmptyState'
import { MissionListCard } from '@/components/molecules/MissionListCard'
import { shouldAnimateList } from '@/lib/motion/list-motion'
import { toMissionListItems, type RawMission } from '@/view-models/mission-kanban'

const cardMotion = {
  initial: { opacity: 0, y: 10, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1 },
}

type Props = { missions: RawMission[] }

export function MissionList({ missions }: Props) {
  const rows = toMissionListItems(missions)
  const animateCards = shouldAnimateList(rows.length)

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={Briefcase}
        title="Aucune mission"
        description="Les besoins de staffing apparaîtront ici."
      />
    )
  }

  return (
    <div className="grid auto-rows-fr gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {rows.map((row, index) => {
        if (!animateCards) return <MissionListCard key={row.id} row={row} />
        return (
          <motion.div
            key={row.id}
            className="h-full"
            {...cardMotion}
            transition={{ duration: 0.22, delay: index * 0.03 }}
          >
            <MissionListCard row={row} />
          </motion.div>
        )
      })}
    </div>
  )
}
