import { Card } from '@/components/atoms/Card'
import { PilotagePoleMeter } from '@/components/molecules/PilotagePoleMeter'
import { PILOTAGE_POLE_CA, PILOTAGE_POLE_MARGE } from '@/view-models/facturation-pilotage-poles-copy'
import type { PoleProgress } from '@/view-models/facturation-pilotage-pole-progress'

type Props = { title: string; progress: PoleProgress }

export function PilotagePoleCard({ title, progress }: Props) {
  return (
    <Card className="space-y-4">
      <h3 className="text-base font-semibold text-fg">{title}</h3>
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
