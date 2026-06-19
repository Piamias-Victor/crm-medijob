'use client'

import { useLayoutEffect, useState, type CSSProperties, type RefObject } from 'react'

export function useFloatingPanel(
  open: boolean,
  anchorRef: RefObject<HTMLElement | null>,
  width: 'anchor' | number = 'anchor',
) {
  const [style, setStyle] = useState<CSSProperties | null>(null)

  useLayoutEffect(() => {
    if (!open) {
      setStyle(null)
      return
    }
    const anchor = anchorRef.current
    if (!anchor) return

    const update = () => {
      const rect = anchor.getBoundingClientRect()
      setStyle({
        position: 'fixed',
        top: rect.bottom + 4,
        left: rect.left,
        width: width === 'anchor' ? rect.width : width,
        zIndex: 9999,
      })
    }

    update()
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [open, anchorRef, width])

  return style
}
