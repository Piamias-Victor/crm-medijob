'use client'

import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/molecules/PageHeader'
import { pageEntrance } from '@/lib/motion/variants'
import { cn } from '@/lib/cn'

type Props = {
  icon: ReactNode
  title: string
  description?: string
  nav?: ReactNode
  actions?: ReactNode
  maxWidth?: string
  children: ReactNode
}

export function DashboardPage({
  icon,
  title,
  description,
  nav,
  actions,
  maxWidth = 'max-w-[88rem]',
  children,
}: Props) {
  return (
    <motion.div
      variants={pageEntrance}
      initial="hidden"
      animate="visible"
      className={cn('mx-auto flex w-full flex-col gap-6', maxWidth)}
    >
      <PageHeader icon={icon} title={title} description={description} actions={actions}>
        {nav}
      </PageHeader>
      {children}
    </motion.div>
  )
}
