'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Calendar } from 'lucide-react'
import { cn } from '@/lib/cn'
import { DatePickerPanel } from '@/components/molecules/DatePickerPanel'
import {
  calendarDays,
  formatDisplayDate,
  formatIsoDate,
  parseIsoDate,
} from '@/lib/date-picker-utils'
import { useAnchoredPanel } from '@/lib/use-anchored-panel'

const PANEL_WIDTH = 288

type Props = {
  value?: string
  onChange: (value: string | undefined) => void
  id?: string
}

export function DatePicker({ value, onChange, id }: Props) {
  const selected = parseIsoDate(value)
  const today = new Date()
  const [open, setOpen] = useState(false)
  const [view, setView] = useState(() => selected ?? today)
  const { anchorRef, panelRef, style } = useAnchoredPanel(open, PANEL_WIDTH)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (anchorRef.current?.contains(target)) return
      if (panelRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open, anchorRef, panelRef])

  const panel = open ? (
    <div
      ref={panelRef}
      style={style}
      className="overflow-auto rounded-xl border border-border bg-white p-3 shadow-lg"
    >
      <DatePickerPanel
        view={view}
        selected={selected}
        today={today}
        days={calendarDays(view.getFullYear(), view.getMonth())}
        onPrev={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}
        onNext={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}
        onPick={(date) => {
          onChange(formatIsoDate(date))
          setOpen(false)
        }}
        onClear={() => {
          onChange(undefined)
          setOpen(false)
        }}
      />
    </div>
  ) : null

  return (
    <div ref={anchorRef} className="relative">
      <button
        id={id}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-md border border-border bg-white px-3 py-2 text-sm text-fg outline-none transition-colors hover:border-accent focus:border-accent focus:ring-2 focus:ring-accent-muted"
      >
        <span className={cn(!value && 'text-fg-muted')}>{formatDisplayDate(value)}</span>
        <Calendar className="size-4 text-fg-muted" />
      </button>
      {typeof document !== 'undefined' && panel ? createPortal(panel, document.body) : null}
    </div>
  )
}
