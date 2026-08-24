'use client'

import { SectionCard } from '@/components/molecules/SectionCard'
import { PilotageGaugeBar } from '@/components/molecules/PilotageGaugeBar'
import {
  buildPilotageGaugeCaption,
  PILOTAGE_GAUGE_TITLE,
} from '@/view-models/facturation-pilotage-gauge-copy'
import type { PilotageGauge } from '@/view-models/facturation-pilotage-gauge'

export function FacturationPilotageGauge({ gauge }: { gauge: PilotageGauge }) {
  return (
    <SectionCard
      variant="glass"
      title={PILOTAGE_GAUGE_TITLE}
      description={buildPilotageGaugeCaption(gauge)}
      bodyClassName="p-4 sm:p-5"
    >
      <PilotageGaugeBar gauge={gauge} />
    </SectionCard>
  )
}
