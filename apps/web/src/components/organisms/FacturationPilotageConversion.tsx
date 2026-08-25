import { SectionCard } from '@/components/molecules/SectionCard'
import { PilotageConversionCardView } from '@/components/molecules/PilotageConversionCardView'
import {
  PILOTAGE_CONVERSION_CDD,
  PILOTAGE_CONVERSION_CDI,
  PILOTAGE_CONVERSION_TITLE,
} from '@/view-models/facturation-pilotage-conversion-copy'
import type { PilotageConversion } from '@/view-models/facturation-pilotage-conversion'

export function FacturationPilotageConversion({ conversion }: { conversion: PilotageConversion }) {
  return (
    <SectionCard variant="glass" title={PILOTAGE_CONVERSION_TITLE} bodyClassName="p-4 sm:p-5">
      <div className="grid gap-4 md:grid-cols-2">
        <PilotageConversionCardView title={PILOTAGE_CONVERSION_CDI} card={conversion.cdi} />
        <PilotageConversionCardView title={PILOTAGE_CONVERSION_CDD} card={conversion.cdd} />
      </div>
    </SectionCard>
  )
}
