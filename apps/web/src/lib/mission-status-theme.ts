import type { MissionStatus } from '@prisma/client'

type BadgeVariant = 'default' | 'primary' | 'accent' | 'success' | 'warning' | 'error'

export type MissionStatusTheme = {
  badge: BadgeVariant
  header: string
  dot: string
  columnRing: string
  cardAccent: string
}

export const MISSION_STATUS_THEME: Record<MissionStatus, MissionStatusTheme> = {
  A_POURVOIR: {
    badge: 'warning',
    header: 'bg-gradient-to-r from-warning/20 via-warning/5 to-white',
    dot: 'bg-warning',
    columnRing: 'ring-warning/25',
    cardAccent: 'border-l-warning from-warning/8 to-white',
  },
  EN_RECHERCHE: {
    badge: 'accent',
    header: 'bg-gradient-to-r from-accent-muted via-white to-white',
    dot: 'bg-accent',
    columnRing: 'ring-accent/25',
    cardAccent: 'border-l-accent from-accent-muted/60 to-white',
  },
  CANDIDATS_PRESENTES: {
    badge: 'primary',
    header: 'bg-gradient-to-r from-primary-muted via-white to-white',
    dot: 'bg-primary',
    columnRing: 'ring-primary/20',
    cardAccent: 'border-l-primary from-primary-muted/80 to-white',
  },
  ENTRETIEN_EN_COURS: {
    badge: 'success',
    header: 'bg-gradient-to-r from-success/20 via-success/5 to-white',
    dot: 'bg-success',
    columnRing: 'ring-success/25',
    cardAccent: 'border-l-success from-success/8 to-white',
  },
  POURVU: {
    badge: 'success',
    header: 'bg-gradient-to-r from-success/15 via-white to-white',
    dot: 'bg-success',
    columnRing: 'ring-success/20',
    cardAccent: 'border-l-success from-success/5 to-white',
  },
  ANNULEE: {
    badge: 'error',
    header: 'bg-gradient-to-r from-error/15 via-white to-white',
    dot: 'bg-error',
    columnRing: 'ring-error/20',
    cardAccent: 'border-l-error from-error/5 to-white',
  },
}
