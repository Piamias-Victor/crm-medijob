'use client'

import { type CSSProperties, useLayoutEffect, useRef, useState } from 'react'

type PanelRect = { top: number; left: number; width: number; maxHeight: number }

export function useAnchoredPanel(open: boolean, panelWidth?: number) {
  const anchorRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [rect, setRect] = useState<PanelRect>({ top: 0, left: 0, width: 0, maxHeight: 320 })

  useLayoutEffect(() => {
    if (!open || !anchorRef.current) return

    const update = () => {
      const trigger = anchorRef.current!.getBoundingClientRect()
      const panel = panelRef.current?.getBoundingClientRect()
      const width = panelWidth ?? trigger.width
      const height = panel?.height ?? 320
      const gap = 4
      const spaceBelow = window.innerHeight - trigger.bottom - gap
      const spaceAbove = trigger.top - gap
      const openUp = spaceBelow < height && spaceAbove > spaceBelow
      const maxHeight = Math.max(120, openUp ? spaceAbove - 8 : spaceBelow - 8)
      const left = Math.max(8, Math.min(trigger.left, window.innerWidth - width - 8))
      const top = openUp
        ? Math.max(8, trigger.top - Math.min(height, maxHeight) - gap)
        : trigger.bottom + gap

      setRect({ top, left, width, maxHeight })
    }

    update()
    const raf = requestAnimationFrame(update)
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [open, panelWidth])

  const style: CSSProperties = {
    position: 'fixed',
    top: rect.top,
    left: rect.left,
    width: rect.width,
    maxHeight: rect.maxHeight,
    zIndex: 50,
  }

  return { anchorRef, panelRef, style }
}
