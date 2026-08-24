import { Card } from '@/components/atoms/Card'
import { conversionCardRows } from '@/view-models/facturation-pilotage-conversion-copy'
import type { PilotageConversionCard } from '@/view-models/facturation-pilotage-conversion'

type Props = { title: string; card: PilotageConversionCard }

export function PilotageConversionCardView({ title, card }: Props) {
  return (
    <Card className="space-y-3">
      <h3 className="text-base font-semibold text-fg">{title}</h3>
      <dl className="space-y-2">
        {conversionCardRows(card).map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-2 text-sm">
            <dt className="text-fg-muted">{row.label}</dt>
            <dd className="font-semibold tabular-nums text-fg">{row.value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}
