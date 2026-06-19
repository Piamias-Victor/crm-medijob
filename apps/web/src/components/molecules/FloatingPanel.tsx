'use client'

import { createPortal } from 'react-dom'
import { type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Props = {
  style: CSSProperties | null
  children: ReactNode
  className?: string
}

export function FloatingPanel({ style, children, className }: Props) {
  if (!style || typeof document === 'undefined') return null
  return createPortal(
    <div data-floating-panel style={style} className={cn(className)}>
      {children}
    </div>,
    document.body,
  )
}
