import { cn } from '@/lib/cn'
import type { PilotageGauge } from '@/view-models/facturation-pilotage-gauge'
import { buildPilotageGaugeLegend, gaugeBarWidths } from '@/view-models/facturation-pilotage-gauge-copy'

type Props = { gauge: PilotageGauge }

export function PilotageGaugeBar({ gauge }: Props) {
  const widths = gaugeBarWidths(gauge)
  return (
    <div className="space-y-3">
      <div className="flex h-4 overflow-hidden rounded-full bg-primary-muted">
        <span className="h-full bg-accent" style={{ width: `${widths.realise}%` }} />
        <span className="h-full bg-warning" style={{ width: `${widths.potentiel}%` }} />
        <span className="h-full bg-border" style={{ width: `${widths.reste}%` }} />
      </div>
      <ul className="grid gap-2 text-sm sm:grid-cols-3">
        {buildPilotageGaugeLegend(gauge).map((item) => (
          <li key={item.label} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-fg-muted">
              <span className={cn('size-2.5 rounded-full', item.color)} />
              {item.label}
            </span>
            <span className="font-semibold tabular-nums text-fg">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
