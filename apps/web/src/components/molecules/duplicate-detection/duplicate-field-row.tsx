'use client'

import { Badge } from '@/components/atoms/Badge'
import { DuplicateFieldOption } from '@/components/molecules/duplicate-detection/duplicate-field-option'
import {
  DUPLICATE_DIFFERS,
  DUPLICATE_SELECT_EXISTING,
  DUPLICATE_SELECT_INCOMING,
} from '@/components/organisms/duplicate-detection-page/duplicate-detection-copy'
import { type DuplicateFieldRowProps } from '@/components/organisms/duplicate-detection-page/duplicate-detection-types'
import { getFieldEquals } from '@/lib/merge/duplicate-field-config'
import { fieldValuesDiffer } from '@/lib/merge/field-values-equal'

export function DuplicateFieldRow<T extends Record<string, unknown>>({
  field,
  leftValue,
  rightValue,
  selected,
  onSelect,
}: DuplicateFieldRowProps<T>) {
  const equals = getFieldEquals(field)
  const differs = fieldValuesDiffer(leftValue, rightValue, equals)
  const groupName = String(field.key)

  return (
    <div className="grid grid-cols-[minmax(7rem,11rem)_1fr_1fr] border-b border-border/70 last:border-b-0">
      <div className="flex flex-wrap items-center gap-2 px-4 py-3 text-sm font-medium text-fg">
        {field.label}
        {differs ? <Badge variant="warning">{DUPLICATE_DIFFERS}</Badge> : null}
      </div>
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
