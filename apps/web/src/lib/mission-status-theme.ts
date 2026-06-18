import type { MissionStatus } from '@prisma/client'

type BadgeVariant = 'default' | 'primary' | 'accent' | 'success' | 'warning' | 'error'

export type MissionStatusTheme = {
  badge: BadgeVariant
  dot: string
  columnBorder: string
  columnBg: string
  countBadge: string
}

export const MISSION_STATUS_THEME: Record<MissionStatus, MissionStatusTheme> = {
  A_POURVOIR: {
    badge: 'warning',
    dot: 'bg-warning/45',
    columnBorder: 'border-warning/15',
    columnBg: 'bg-warning/5',
    countBadge: 'bg-warning/10 text-warning/90',
  },
  EN_RECHERCHE: {
    badge: 'accent',
    dot: 'bg-accent/50',
    columnBorder: 'border-accent/18',
    columnBg: 'bg-accent-muted/30',
    countBadge: 'bg-accent-muted/80 text-accent-hover/90',
  },
  CANDIDATS_PRESENTES: {
    badge: 'primary',
    dot: 'bg-primary/45',
    columnBorder: 'border-primary/15',
    columnBg: 'bg-primary-muted/25',
    countBadge: 'bg-primary-muted/70 text-primary/80',
  },
  ENTRETIEN_EN_COURS: {
    badge: 'success',
    dot: 'bg-success/45',
    columnBorder: 'border-success/15',
    columnBg: 'bg-success/5',
    countBadge: 'bg-success/10 text-success/90',
  },
  POURVU: {
    badge: 'success',
    dot: 'bg-success/40',
    columnBorder: 'border-success/12',
    columnBg: 'bg-success/4',
    countBadge: 'bg-success/10 text-success/85',
  },
  ANNULEE: {
    badge: 'error',
    dot: 'bg-error/40',
    columnBorder: 'border-error/12',
    columnBg: 'bg-error/4',
    countBadge: 'bg-error/10 text-error/85',
  },
}
