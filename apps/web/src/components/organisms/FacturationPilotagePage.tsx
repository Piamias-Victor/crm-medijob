'use client'

import { Alert } from '@/components/atoms/Alert'
import { SectionCard } from '@/components/molecules/SectionCard'
import { StatTiles } from '@/components/molecules/StatTiles'
import { FacturationPilotageCharts } from '@/components/organisms/FacturationPilotageCharts'
import { FacturationPilotageConversion } from '@/components/organisms/FacturationPilotageConversion'
import { FacturationPilotageGauge } from '@/components/organisms/FacturationPilotageGauge'
import { FacturationPilotageGoNoGo } from '@/components/organisms/FacturationPilotageGoNoGo'
import { FacturationPilotageMatrix } from '@/components/organisms/FacturationPilotageMatrix'
import { FacturationPilotageMonthly } from '@/components/organisms/FacturationPilotageMonthly'
import { FacturationPilotagePoles } from '@/components/organisms/FacturationPilotagePoles'
import { FacturationFilterBar } from '@/components/organisms/facturation-table/facturation-filter-bar'
import { useFacturationPilotageQuery } from '@/lib/hooks/use-facturation-pilotage-query'
import { buildPilotageCancelledCopy } from '@/view-models/facturation-pilotage-cancelled-copy'
import { buildPilotageKpis } from '@/view-models/facturation-pilotage-kpis'
import type { Pilotage } from '@/view-models/facturation-pilotage'
import type { PilotageFilterConfig } from '@/lib/filters/pilotage-filter-config'
import type { PilotageFilters } from '@/view-models/facturation-pilotage-filters.schema'

type Props = {
  initialPilotage: Pilotage
  serverFilters: PilotageFilters
  filterConfig: PilotageFilterConfig
}

export function FacturationPilotagePage({ initialPilotage, serverFilters, filterConfig }: Props) {
  const { values, setFilters, reset, pilotage } = useFacturationPilotageQuery(
    initialPilotage,
    serverFilters,
    filterConfig,
  )
  return (
    <div className="space-y-4">
      <FacturationFilterBar
        filterConfig={filterConfig}
        values={values}
        onChange={setFilters}
        onReset={reset}
      />
      {pilotage.cancelled.count > 0 ? (
        <Alert variant="error">{buildPilotageCancelledCopy(pilotage.cancelled)}</Alert>
      ) : null}
      <SectionCard
        variant="glass"
        title="Pilotage"
        description="CA, Marge, placements et pharmacies de l’Exercice."
        bodyClassName="p-4 sm:p-5"
      >
        <StatTiles items={buildPilotageKpis(pilotage.kpis)} />
      </SectionCard>
      <FacturationPilotageGauge gauge={pilotage.gauge} />
      <FacturationPilotagePoles key={pilotage.months.join(',')} poles={pilotage.poles} />
      <FacturationPilotageCharts charts={pilotage.charts} />
      <FacturationPilotageConversion conversion={pilotage.conversion} />
      <FacturationPilotageGoNoGo goNoGo={pilotage.goNoGo} />
      <FacturationPilotageMonthly key={pilotage.months.join(',')} monthly={pilotage.monthly} />
      <FacturationPilotageMatrix matrix={pilotage.matrix} />
    </div>
  )
}
