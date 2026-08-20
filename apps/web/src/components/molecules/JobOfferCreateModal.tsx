'use client'

import { GlassModal } from '@/components/molecules/GlassModal'
import { Combobox } from '@/components/molecules/Combobox'
import { Button } from '@/components/atoms/Button'
import type { ComboboxOption } from '@/components/molecules/ComboboxDropdown.types'
import {
  PICK_MISSION_CANCEL,
  PICK_MISSION_CONTINUE,
  PICK_MISSION_HINT,
  PICK_MISSION_PLACEHOLDER,
  PICK_MISSION_TITLE,
} from '@/view-models/mission-offer-picker'

type Props = {
  open: boolean
  options: ComboboxOption[]
  missionId: string
  onMissionIdChange: (id: string) => void
  onClose: () => void
  onContinue: () => void
}

export function JobOfferCreateModal({
  open,
  options,
  missionId,
  onMissionIdChange,
  onClose,
  onContinue,
}: Props) {
  return (
    <GlassModal open={open} onClose={onClose} title={PICK_MISSION_TITLE} className="max-w-md">
      <div className="space-y-4">
        <p className="text-sm text-fg-muted">{PICK_MISSION_HINT}</p>
        <Combobox
          value={missionId || undefined}
          onChange={onMissionIdChange}
          options={options}
          placeholder={PICK_MISSION_PLACEHOLDER}
        />
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="outline" onClick={onClose}>
            {PICK_MISSION_CANCEL}
          </Button>
          <Button type="button" variant="accent" disabled={!missionId} onClick={onContinue}>
            {PICK_MISSION_CONTINUE}
          </Button>
        </div>
      </div>
    </GlassModal>
  )
}
