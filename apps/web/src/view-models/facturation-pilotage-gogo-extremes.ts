import type { PilotageGoNoGo, PilotageGoNoGoMonth } from '@/view-models/facturation-pilotage-gogo'

function nogoCount(row: PilotageGoNoGoMonth) {
  return row.cdiNogo + row.cddNogo
}

function engagedCount(row: PilotageGoNoGoMonth) {
  return row.cdiOk + row.cddOk + nogoCount(row)
}

export function goNoGoExtremes(
  rows: PilotageGoNoGoMonth[],
): Pick<PilotageGoNoGo, 'topNogo' | 'fullConversion'> {
  const topNogo = [...rows]
    .filter((row) => nogoCount(row) > 0)
    .sort((a, b) => nogoCount(b) - nogoCount(a) || a.month.localeCompare(b.month))
    .slice(0, 3)
    .map((row) => ({ month: row.month, label: row.label, nogo: nogoCount(row) }))
  const fullConversion = rows
    .filter((row) => engagedCount(row) > 0 && nogoCount(row) === 0)
    .map((row) => ({ month: row.month, label: row.label }))
  return { topNogo, fullConversion }
}
