'use client'

import { motion } from 'framer-motion'
import { type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { SURFACE_GLASS } from '@/lib/constants/surface-glass'
import { LOGIN_CARD_MOTION } from '@/lib/motion/login-motion'

type Props = { children: ReactNode; className?: string }

export function LoginCard({ children, className }: Props) {
  return (
    <motion.div {...LOGIN_CARD_MOTION}>
      <div className={cn(SURFACE_GLASS, 'p-8', className)}>{children}</div>
    </motion.div>
  )
}
