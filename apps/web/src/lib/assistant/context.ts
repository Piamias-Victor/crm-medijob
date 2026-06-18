import type { ShortcutEntityType } from '@/server/ai/shortcuts'

export type ContextValue = {
  entityType?: ShortcutEntityType
  entityId?: string
  entityLabel?: string
}

type ContextOption = {
  value: ShortcutEntityType
  label: string
  placeholder: string
}

export const CONTEXT_OPTIONS: readonly ContextOption[] = [
  { value: 'candidate', label: 'Candidat', placeholder: 'Rechercher un candidat…' },
  { value: 'pharmacy', label: 'Pharmacie', placeholder: 'Rechercher une pharmacie…' },
  { value: 'mission', label: 'Mission', placeholder: 'Rechercher une mission…' },
] as const

export function contextPlaceholder(entityType: ShortcutEntityType): string {
  return CONTEXT_OPTIONS.find((option) => option.value === entityType)?.placeholder ?? 'Rechercher…'
}
