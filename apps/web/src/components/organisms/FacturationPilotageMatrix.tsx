import { PilotagePlainTable } from '@/components/molecules/PilotagePlainTable'
import { SectionCard } from '@/components/molecules/SectionCard'
import {
  PILOTAGE_MATRIX_TITLE,
  matrixDisplayRows,
  matrixHeaders,
} from '@/view-models/facturation-pilotage-matrix-copy'
import type { PilotageMatrix } from '@/view-models/facturation-pilotage-matrix'

export function FacturationPilotageMatrix({ matrix }: { matrix: PilotageMatrix }) {
  return (
    <SectionCard variant="glass" title={PILOTAGE_MATRIX_TITLE} bodyClassName="p-4 sm:p-5">
      <PilotagePlainTable headers={matrixHeaders(matrix.months)} rows={matrixDisplayRows(matrix)} />
    </SectionCard>
  )
}
