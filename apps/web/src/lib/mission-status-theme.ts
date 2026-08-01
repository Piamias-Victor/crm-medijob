import type { MissionStatus } from '@prisma/client'

type BadgeVariant = 'default' | 'primary' | 'accent' | 'sky' | 'rose' | 'success' | 'warning' | 'error'

export type MissionStatusTheme = {
  badge: BadgeVariant
  dot: string
  columnBorder: string
  columnBg: string
  countBadge: string
}

export const MISSION_STATUS_THEME: Record<MissionStatus, MissionStatusTheme> = {
  A_POURVOIR: {
    badge: 'rose',
    dot: 'bg-rose/45',
    columnBorder: 'border-rose/15',
    columnBg: 'bg-rose-muted/40',
    countBadge: 'bg-rose-muted text-rose-fg',
  },
  EN_RECHERCHE: {
    badge: 'accent',
    dot: 'bg-accent/50',
    columnBorder: 'border-accent/18',
    columnBg: 'bg-accent-muted/30',
    countBadge: 'bg-accent-muted/80 text-accent-hover/90',
  },
  CANDIDATS_PRESENTES: {
    badge: 'sky',
    dot: 'bg-sky/45',
    columnBorder: 'border-sky/15',
    columnBg: 'bg-sky-muted/40',
    countBadge: 'bg-sky-muted text-sky-fg',
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
