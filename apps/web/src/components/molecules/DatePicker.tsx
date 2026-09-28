'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { DatePickerPanel } from '@/components/molecules/DatePickerPanel'
import { DatePickerTrigger } from '@/components/molecules/DatePickerTrigger'
import {
  ASAP_DATE_LABEL,
  calendarDays,
  formatIsoDate,
  parseIsoDate,
} from '@/lib/date-picker-utils'
import { useAnchoredPanel } from '@/lib/use-anchored-panel'

const PANEL_WIDTH = 288

type Props = {
  value?: string
  onChange: (value: string | undefined) => void
  id?: string
  emptyLabel?: string
  clearLabel?: string
  ariaLabel?: string
  disabled?: boolean
  className?: string
}

export function DatePicker({
  value,
  onChange,
  id,
  emptyLabel = ASAP_DATE_LABEL,
  clearLabel = ASAP_DATE_LABEL,
  ariaLabel,
  disabled = false,
  className,
}: Props) {
  const selected = parseIsoDate(value)
  const today = new Date()
  const [open, setOpen] = useState(false)
  const [view, setView] = useState(() => selected ?? today)
  const { anchorRef, panelRef, style } = useAnchoredPanel(open, PANEL_WIDTH)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (anchorRef.current?.contains(target) || panelRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open, anchorRef, panelRef])

  const panel = open ? (
    <div
      ref={panelRef}
      data-floating-panel
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
        clearLabel={clearLabel}
      />
    </div>
  ) : null

  return (
    <div ref={anchorRef} className="relative">
      <DatePickerTrigger
        id={id}
        ariaLabel={ariaLabel}
        disabled={disabled}
        className={className}
        value={value}
        emptyLabel={emptyLabel}
        onToggle={() => {
          if (!disabled) setOpen((v) => !v)
        }}
      />
      {typeof document !== 'undefined' && panel ? createPortal(panel, document.body) : null}
    </div>
  )
}
