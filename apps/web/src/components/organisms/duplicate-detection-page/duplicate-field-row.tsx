'use client'

import { cn } from '@/lib/cn'
import {
  DUPLICATE_SELECT_EXISTING,
  DUPLICATE_SELECT_INCOMING,
} from '@/components/organisms/duplicate-detection-page/duplicate-detection-copy'
import { DuplicateFieldOption } from '@/components/organisms/duplicate-detection-page/duplicate-field-option'
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
        'grid grid-cols-[minmax(7rem,11rem)_1fr_1fr] border-b border-border/70 last:border-b-0',
        differs && 'bg-warning/[0.07]',
      )}
    >
      <div className="flex items-center px-4 py-3 text-sm font-medium text-fg">{field.label}</div>
      <DuplicateFieldOption
        name={groupName}
        selected={selected === 'left'}
        label={`${field.label} — ${DUPLICATE_SELECT_EXISTING}`}
        onSelect={() => onSelect('left')}
      >
        {field.render(leftValue)}
      </DuplicateFieldOption>
      <DuplicateFieldOption
        name={groupName}
        selected={selected === 'right'}
        label={`${field.label} — ${DUPLICATE_SELECT_INCOMING}`}
        onSelect={() => onSelect('right')}
      >
        {field.render(rightValue)}
      </DuplicateFieldOption>
    </div>
  )
}
