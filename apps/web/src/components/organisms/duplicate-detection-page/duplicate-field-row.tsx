'use client'

import { cn } from '@/lib/cn'
import {
  DUPLICATE_KEEP_LEFT,
  DUPLICATE_KEEP_RIGHT,
} from '@/components/organisms/duplicate-detection-page/duplicate-detection-copy'
import { type DuplicateFieldRowProps } from '@/components/organisms/duplicate-detection-page/duplicate-detection-types'

export function DuplicateFieldRow<T extends Record<string, unknown>>({
  field,
  leftValue,
  rightValue,
  selected,
  onSelect,
}: DuplicateFieldRowProps<T>) {
  const differs = leftValue !== rightValue
  const groupName = String(field.key)

  return (
    <div
      className={cn(
        'rounded-lg border p-4',
        differs ? 'border-warning/25 bg-warning/8' : 'border-border bg-surface',
      )}
    >
      <p className="mb-3 text-sm font-medium text-fg">{field.label}</p>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex cursor-pointer gap-3 rounded-md border border-border/60 p-3">
          <input
            type="radio"
            name={groupName}
            checked={selected === 'left'}
            onChange={() => onSelect('left')}
            className="mt-1"
          />
          <span className="space-y-1">
            <span className="block text-xs text-fg-muted">{DUPLICATE_KEEP_LEFT}</span>
            <span className="block text-sm text-fg">{field.render(leftValue)}</span>
          </span>
        </label>
        <label className="flex cursor-pointer gap-3 rounded-md border border-border/60 p-3">
          <input
            type="radio"
            name={groupName}
            checked={selected === 'right'}
            onChange={() => onSelect('right')}
            className="mt-1"
          />
          <span className="space-y-1">
            <span className="block text-xs text-fg-muted">{DUPLICATE_KEEP_RIGHT}</span>
            <span className="block text-sm text-fg">{field.render(rightValue)}</span>
          </span>
        </label>
      </div>
    </div>
  )
}
