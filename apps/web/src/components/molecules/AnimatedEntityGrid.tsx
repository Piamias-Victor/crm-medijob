'use client'

import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { shouldAnimateList } from '@/lib/motion/list-motion'

const cardMotion = {
  initial: { opacity: 0, y: 10, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1 },
}

type Props<T> = {
  items: T[]
  getKey: (item: T) => string
  renderItem: (item: T) => ReactNode
  className?: string
}

export function AnimatedEntityGrid<T>({ items, getKey, renderItem, className }: Props<T>) {
  const animateCards = shouldAnimateList(items.length)

  return (
    <div className={className ?? 'grid auto-rows-fr gap-3 sm:grid-cols-2 xl:grid-cols-3'}>
      {items.map((item, index) => {
        const key = getKey(item)
        if (!animateCards) return <div key={key} className="h-full">{renderItem(item)}</div>
        return (
          <motion.div
            key={key}
            className="h-full"
            {...cardMotion}
            transition={{ duration: 0.22, delay: index * 0.03 }}
          >
            {renderItem(item)}
          </motion.div>
        )
      })}
    </div>
  )
}
