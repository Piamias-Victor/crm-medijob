'use client'

import { useEffect, useRef, useState } from 'react'
import { Calendar } from 'lucide-react'
import { cn } from '@/lib/cn'
import { DatePickerPanel } from '@/components/molecules/DatePickerPanel'
import { FloatingPanel } from '@/components/molecules/FloatingPanel'
import { useFloatingPanel } from '@/lib/hooks/use-floating-panel'
import {
  ASAP_DATE_LABEL,
  calendarDays,
  formatDisplayDate,
  formatIsoDate,
  parseIsoDate,
} from '@/lib/date-picker-utils'

type Props = {
  value?: string
  onChange: (value: string | undefined) => void
  id?: string
  emptyLabel?: string
  clearLabel?: string
}

export function DatePicker({
  value,
  onChange,
  id,
  emptyLabel = ASAP_DATE_LABEL,
  clearLabel = ASAP_DATE_LABEL,
}: Props) {
  const selected = parseIsoDate(value)
  const today = new Date()
  const [open, setOpen] = useState(false)
  const [view, setView] = useState(() => selected ?? today)
  const root = useRef<HTMLDivElement>(null)
  const panelStyle = useFloatingPanel(open, root, 288)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (root.current?.contains(target)) return
      if (target instanceof Element && target.closest('[data-floating-panel]')) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={root} className="relative">
      <button
        id={id}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-md border border-border bg-white px-3 py-2 text-sm text-fg outline-none transition-colors hover:border-accent focus:border-accent focus:ring-2 focus:ring-accent-muted"
      >
        <span className={cn(!value && 'text-fg-muted')}>{formatDisplayDate(value, emptyLabel)}</span>
        <Calendar className="size-4 text-fg-muted" />
      </button>
      <FloatingPanel
        style={panelStyle}
        className="overflow-hidden rounded-xl border border-border bg-white p-3 shadow-lg"
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
          clearLabel={clearLabel}
        />
      </FloatingPanel>
    </div>
  )
}
