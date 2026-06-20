'use client'

import { Ban, Sparkles, Users } from 'lucide-react'
import { cn } from '@/lib/cn'

type StatProps = {
  label: string
  value: number
  icon: typeof Sparkles
  tone: 'accent' | 'success' | 'muted'
}

function StatCard({ label, value, icon: Icon, tone }: StatProps) {
  const tones = {
    accent: 'border-accent/20 bg-accent-muted/30 text-accent',
    success: 'border-success/25 bg-success/10 text-success',
    muted: 'border-border/60 bg-surface/60 text-fg-muted',
  }

  return (
    <div className={cn('rounded-xl border p-4', tones[tone])}>
      <div className="flex items-center justify-between gap-2">
        <Icon className="size-4 opacity-80" aria-hidden />
        <span className="text-2xl font-bold tabular-nums text-fg">{value}</span>
      </div>
      <p className="mt-2 text-xs font-medium text-fg-muted">{label}</p>
    </div>
  )
}

type Props = {
  scoredCount: number
  excludedCount: number
}

export function MissionMatchingStats({ scoredCount, excludedCount }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <StatCard label="Candidats scorés" value={scoredCount} icon={Sparkles} tone="success" />
      <StatCard label="Éligibles (pré-filtre)" value={scoredCount} icon={Users} tone="accent" />
      <StatCard label="Exclus" value={excludedCount} icon={Ban} tone="muted" />
    </div>
  )
}
