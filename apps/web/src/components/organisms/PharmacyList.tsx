'use client'

import { motion } from 'framer-motion'
import { Building2 } from 'lucide-react'
import { EmptyState } from '@/components/atoms/EmptyState'
import { PharmacyListCard } from '@/components/molecules/PharmacyListCard'
import { shouldAnimateList } from '@/lib/motion/list-motion'
import type { PharmacyListRow } from '@/view-models/pharmacy-list'

const cardMotion = {
  initial: { opacity: 0, y: 10, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1 },
}

type Props = {
  rows: PharmacyListRow[]
}

export function PharmacyList({ rows }: Props) {
  const animateCards = shouldAnimateList(rows.length)

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="Aucune pharmacie"
        description="Ajoutez votre première pharmacie au portefeuille."
      />
    )
  }

  return (
    <div className="grid auto-rows-fr gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {rows.map((row, index) => {
        if (!animateCards) {
          return <PharmacyListCard key={row.id} row={row} />
        }
        return (
          <motion.div
            key={row.id}
            className="h-full"
            {...cardMotion}
            transition={{ duration: 0.22, delay: index * 0.03 }}
          >
            <PharmacyListCard row={row} />
          </motion.div>
        )
      })}
    </div>
  )
}
