'use client'

import { motion } from 'framer-motion'
import { Inbox } from 'lucide-react'
import { EmptyState } from '@/components/atoms/EmptyState'
import { ApplicationInboxCard } from '@/components/molecules/ApplicationInboxCard'
import { shouldAnimateList } from '@/lib/motion/list-motion'
import type { InboxItem } from '@/view-models/application-inbox'

const cardMotion = {
  initial: { opacity: 0, y: 12, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
}

export function ApplicationInbox({ items }: { items: InboxItem[] }) {
  const animateCards = shouldAnimateList(items.length)

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="Boîte de réception vide"
        description="Les candidatures Webflow apparaîtront ici dès leur réception."
      />
    )
  }

  return (
    <div className="grid auto-rows-fr gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item, index) => {
        if (!animateCards) return <ApplicationInboxCard key={item.id} item={item} />

        return (
          <motion.div
            key={item.id}
            className="h-full"
            {...cardMotion}
            transition={{ duration: 0.24, delay: index * 0.04 }}
          >
            <ApplicationInboxCard item={item} />
          </motion.div>
        )
      })}
    </div>
  )
}
