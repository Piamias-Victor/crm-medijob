'use client'

import { SHORTCUTS, type Shortcut } from '@/lib/assistant-shortcuts'
import { Button } from '@/components/atoms/Button'

type Props = {
  onSelect: (shortcut: Shortcut) => void
  disabled?: boolean
}

export function ShortcutBar({ onSelect, disabled }: Props) {
  return (
    <nav aria-label="Raccourcis" className="flex flex-col gap-2">
      {SHORTCUTS.map((shortcut) => (
        <Button
          key={shortcut.id}
          type="button"
          variant="ghost"
          disabled={disabled}
          onClick={() => onSelect(shortcut)}
          className="justify-start border border-border"
        >
          {shortcut.label}
        </Button>
      ))}
    </nav>
  )
}
