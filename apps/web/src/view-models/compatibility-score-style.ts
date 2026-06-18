import { cn } from '@/lib/cn'

export function compatibilityScoreStyle(score: number): string {
  if (score === 0) return cn('bg-surface text-fg-muted')
  if (score >= 80) return cn('bg-success/15 text-success')
  if (score >= 40) return cn('bg-warning/15 text-warning')
  return cn('bg-error/10 text-error')
}

export function compatibilityScoreBarStyle(score: number): string {
  if (score === 0) return 'bg-border'
  if (score >= 80) return 'bg-success'
  if (score >= 40) return 'bg-warning'
  return 'bg-error'
}
