import { PilotagePlainTable } from '@/components/molecules/PilotagePlainTable'
import { SectionCard } from '@/components/molecules/SectionCard'
import {
  PILOTAGE_GOGO_CAPTION,
  PILOTAGE_GOGO_EMPTY,
  PILOTAGE_GOGO_FULL,
  PILOTAGE_GOGO_HEADERS,
  PILOTAGE_GOGO_TITLE,
  PILOTAGE_GOGO_TOP,
  gogoMonthCells,
} from '@/view-models/facturation-pilotage-gogo-copy'
import type { PilotageGoNoGo } from '@/view-models/facturation-pilotage-gogo'

export function FacturationPilotageGoNoGo({ goNoGo }: { goNoGo: PilotageGoNoGo }) {
  return (
    <SectionCard
      variant="glass"
      title={PILOTAGE_GOGO_TITLE}
      description={PILOTAGE_GOGO_CAPTION}
      bodyClassName="space-y-4 p-4 sm:p-5"
    >
      <PilotagePlainTable
        headers={PILOTAGE_GOGO_HEADERS}
        rows={goNoGo.months.map((row) => ({ id: row.month, cells: gogoMonthCells(row) }))}
      />
      <div className="grid gap-4 text-sm md:grid-cols-2">
        <ExtremeList title={PILOTAGE_GOGO_TOP} items={goNoGo.topNogo.map((row) => `${row.label} · ${row.nogo}`)} />
        <ExtremeList title={PILOTAGE_GOGO_FULL} items={goNoGo.fullConversion.map((row) => row.label)} />
      </div>
    </SectionCard>
  )
}

function ExtremeList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="mb-2 font-semibold text-fg">{title}</h3>
      {items.length === 0 ? <p className="text-fg-muted">{PILOTAGE_GOGO_EMPTY}</p> : null}
      {items.length > 0 ? (
        <ul className="space-y-1 text-fg">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
