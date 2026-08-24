import { formatPilotageRatio } from '@/view-models/facturation-pilotage-poles-copy'

type Props = { label: string; value: number; objectif: number; pct: number }

export function PilotagePoleMeter({ label, value, objectif, pct }: Props) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <span className="text-fg-muted">{label}</span>
        <span className="font-semibold tabular-nums text-fg">{formatPilotageRatio(value, objectif)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-primary-muted">
        <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
