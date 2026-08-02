import type { ResponseKind } from './schemas'

export type ShortcutEntityType = 'candidate' | 'pharmacy' | 'mission'

export type Shortcut = {
  id: string
  label: string
  kind: ResponseKind
  entityType?: ShortcutEntityType
  instruction: string
}

export const SHORTCUTS: readonly Shortcut[] = [
  {
    id: 'candidate-summary',
    label: 'Résumer candidat',
    kind: 'summary',
    entityType: 'candidate',
    instruction: 'Résume ce profil candidat en français de façon concise et professionnelle.',
  },
  {
    id: 'pharmacy-summary',
    label: 'Résumer pharmacie',
    kind: 'summary',
    entityType: 'pharmacy',
    instruction: 'Résume cette pharmacie (activité, contexte, points clés) en français.',
  },
  {
    id: 'candidate-email',
    label: 'Rédiger mail candidat',
    kind: 'email',
    entityType: 'candidate',
    instruction: 'Rédige un email professionnel et chaleureux à destination de ce candidat.',
  },
  {
    id: 'pharmacy-email',
    label: 'Rédiger mail pharmacie',
    kind: 'email',
    entityType: 'pharmacy',
    instruction: 'Rédige un email professionnel à destination de cette pharmacie.',
  },
  {
    id: 'generate-offer',
    label: 'Générer offre',
    kind: 'offer',
    entityType: 'mission',
    instruction: 'Rédige une offre d’emploi attractive et complète à partir de cette mission.',
  },
  {
    id: 'week-report',
    label: 'Rapport semaine',
    kind: 'report',
    instruction:
      'Rédige un compte rendu hebdomadaire en français à partir UNIQUEMENT des métriques fournies : missions ouvertes/pourvues, candidats contactés, candidatures, offres, actions commerciales, puis points bloquants et priorités semaine suivante.',
  },
  {
    id: 'best-profiles',
    label: 'Meilleurs profils',
    kind: 'summary',
    entityType: 'mission',
    instruction:
      'À partir du matching fourni, présente les meilleurs profils pour cette mission (ordre de score, points forts). N’invente aucun candidat hors liste.',
  },
] as const

export function findShortcut(id: string): Shortcut | undefined {
  return SHORTCUTS.find((shortcut) => shortcut.id === id)
}
