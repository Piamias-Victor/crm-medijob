import type { CandidateCsvColumnMap } from '@/view-models/candidate-csv-import.schema'

function cellAt(headers: string[], cells: string[], header: string | undefined): string | undefined {
  if (!header) return undefined
  const index = headers.indexOf(header)
  if (index < 0) return undefined
  return cells[index]
}

function parseMobilityKm(raw: string | undefined): number | undefined {
  if (!raw?.trim()) return undefined
  const value = Number.parseInt(raw.trim(), 10)
  return Number.isFinite(value) ? value : Number.NaN
}

export function buildCandidateCsvRowPayload(
  headers: string[],
  cells: string[],
  map: CandidateCsvColumnMap,
) {
  const mobilityRaw = cellAt(headers, cells, map.mobilityRadiusKm)
  return {
    jobTitleLabel: cellAt(headers, cells, map.jobTitle),
    statusRaw: cellAt(headers, cells, map.status),
    mobilityRadiusKm: parseMobilityKm(mobilityRaw),
    fields: {
      firstName: cellAt(headers, cells, map.firstName) ?? '',
      lastName: cellAt(headers, cells, map.lastName) ?? '',
      email: cellAt(headers, cells, map.email),
      phone: cellAt(headers, cells, map.phone),
      address: cellAt(headers, cells, map.address),
      city: cellAt(headers, cells, map.city),
      postalCode: cellAt(headers, cells, map.postalCode),
      salaryExpectations: cellAt(headers, cells, map.salaryExpectations),
      notes: cellAt(headers, cells, map.notes),
    },
  }
}
