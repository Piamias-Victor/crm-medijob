'use client'

import { ContextTypePills } from '@/components/molecules/ContextTypePills'
import { EntitySearch } from '@/components/molecules/EntitySearch'
import { FormSection } from '@/components/molecules/FormSection'
import type { ContextValue } from '@/lib/assistant/context'
import type { ShortcutEntityType } from '@/server/ai/shortcuts'

type Props = {
  value: ContextValue
  onChange: (value: ContextValue) => void
}

export function ContextPicker({ value, onChange }: Props) {
  const selectType = (entityType?: ShortcutEntityType) => onChange({ entityType })

  return (
    <FormSection title="Contexte">
      <div className="flex flex-col gap-3">
        <ContextTypePills value={value.entityType} onChange={selectType} />
        {value.entityType ? (
          <EntitySearch entityType={value.entityType} value={value} onChange={onChange} />
        ) : null}
      </div>
    </FormSection>
  )
}
