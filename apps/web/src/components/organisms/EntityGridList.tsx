'use client'

import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { EmptyState } from '@/components/atoms/EmptyState'
import { AnimatedEntityGrid } from '@/components/molecules/AnimatedEntityGrid'

type Props<T> = {
  items: T[]
  getKey: (item: T) => string
  renderItem: (item: T) => ReactNode
  emptyIcon: LucideIcon
  emptyTitle: string
  emptyDescription: string
}

export function EntityGridList<T>({
  items,
  getKey,
  renderItem,
  emptyIcon,
  emptyTitle,
  emptyDescription,
}: Props<T>) {
  if (items.length === 0) {
    return <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} />
  }

  return <AnimatedEntityGrid items={items} getKey={getKey} renderItem={renderItem} />
}
