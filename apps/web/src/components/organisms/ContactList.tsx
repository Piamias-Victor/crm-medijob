'use client'

import { motion } from 'framer-motion'
import { User } from 'lucide-react'
import { EmptyState } from '@/components/atoms/EmptyState'
import { ContactListCard } from '@/components/molecules/ContactListCard'
import { shouldAnimateList } from '@/lib/motion/list-motion'
import type { ContactListRow } from '@/view-models/contact-list'

const cardMotion = {
  initial: { opacity: 0, y: 10, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1 },
}

type Props = {
  rows: ContactListRow[]
}

export function ContactList({ rows }: Props) {
  const animateCards = shouldAnimateList(rows.length)

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={User}
        title="Aucun contact"
        description="Ajoutez le premier interlocuteur d'une pharmacie."
      />
    )
  }

  return (
    <div className="grid auto-rows-fr gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {rows.map((row, index) => {
        if (!animateCards) return <ContactListCard key={row.id} row={row} />
        return (
          <motion.div
            key={row.id}
            className="h-full"
            {...cardMotion}
            transition={{ duration: 0.22, delay: index * 0.03 }}
          >
            <ContactListCard row={row} />
          </motion.div>
        )
      })}
    </div>
  )
}
