export type PipelineStageTheme = {
  columnBorder: string
  columnBg: string
  dot: string
  badge: string
}

const THEMES: PipelineStageTheme[] = [
  {
    columnBorder: 'border-primary/15',
    columnBg: 'bg-primary-muted/30',
    dot: 'bg-primary/45',
    badge: 'bg-primary-muted/70 text-primary/80',
  },
  {
    columnBorder: 'border-accent/18',
    columnBg: 'bg-accent-muted/35',
    dot: 'bg-accent/50',
    badge: 'bg-accent-muted/80 text-accent-hover/90',
  },
  {
    columnBorder: 'border-warning/15',
    columnBg: 'bg-warning/6',
    dot: 'bg-warning/45',
    badge: 'bg-warning/10 text-warning/90',
  },
  {
    columnBorder: 'border-success/15',
    columnBg: 'bg-success/6',
    dot: 'bg-success/45',
    badge: 'bg-success/10 text-success/90',
  },
  {
    columnBorder: 'border-primary/12',
    columnBg: 'bg-primary-muted/20',
    dot: 'bg-primary-hover/40',
    badge: 'bg-primary-muted/60 text-primary-hover/80',
  },
  {
    columnBorder: 'border-error/12',
    columnBg: 'bg-error/5',
    dot: 'bg-error/40',
    badge: 'bg-error/10 text-error/85',
  },
]

export function pipelineStageTheme(position: number): PipelineStageTheme {
  return THEMES[position % THEMES.length]!
}
