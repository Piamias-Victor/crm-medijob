'use client'

import { BarChart3, FileText, Mail, Megaphone, type LucideIcon } from 'lucide-react'
import { SHORTCUTS, type Shortcut } from '@/lib/assistant-shortcuts'
import { FormSection } from '@/components/molecules/FormSection'
import { cn } from '@/lib/cn'

const ICONS: Record<string, LucideIcon> = {
  'candidate-summary': FileText,
  'pharmacy-summary': FileText,
  'candidate-email': Mail,
  'pharmacy-email': Mail,
  'generate-offer': Megaphone,
  'week-report': BarChart3,
}

type Props = {
  onSelect: (shortcut: Shortcut) => void
  disabled?: boolean
}

export function ShortcutBar({ onSelect, disabled }: Props) {
  return (
    <FormSection title="Raccourcis">
      <nav aria-label="Raccourcis" className="flex flex-col gap-1.5">
        {SHORTCUTS.map((shortcut) => {
          const Icon = ICONS[shortcut.id] ?? FileText
          return (
            <button
              key={shortcut.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(shortcut)}
              className={cn(
                'flex items-center gap-2.5 rounded-lg border border-border/50 bg-white/80 px-3 py-2 text-left text-sm text-fg transition-colors',
                'hover:border-accent/40 hover:bg-accent-muted/40 disabled:opacity-50',
              )}
            >
              <Icon className="size-4 shrink-0 text-accent" aria-hidden />
              {shortcut.label}
            </button>
          )
        })}
      </nav>
    </FormSection>
  )
}
