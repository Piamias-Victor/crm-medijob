import { Card } from '@/components/atoms/Card'
import { PilotagePoleMeter } from '@/components/molecules/PilotagePoleMeter'
import { PILOTAGE_POLE_CA, PILOTAGE_POLE_MARGE } from '@/view-models/facturation-pilotage-poles-copy'
import type { PoleProgress } from '@/view-models/facturation-pilotage-pole-progress'

type Props = { title: string; caption: string; progress: PoleProgress }

export function PilotagePoleCard({ title, caption, progress }: Props) {
  return (
    <Card className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-fg">{title}</h3>
        <p className="mt-0.5 text-xs text-fg-muted">{caption}</p>
      </div>
      <PilotagePoleMeter
        label={PILOTAGE_POLE_CA}
        value={progress.ca}
        objectif={progress.caObjectif}
        pct={progress.caPct}
      />
      <PilotagePoleMeter
        label={PILOTAGE_POLE_MARGE}
        value={progress.marge}
        objectif={progress.margeObjectif}
        pct={progress.margePct}
      />
    </Card>
  )
}
