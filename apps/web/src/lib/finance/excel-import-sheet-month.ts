const MONTHS: Record<string, number> = {
  JANVIER: 1,
  FEVRIER: 2,
  FÉVRIER: 2,
  MARS: 3,
  AVRIL: 4,
  MAI: 5,
  JUIN: 6,
  JUILLET: 7,
  AOUT: 8,
  AOÛT: 8,
  SEPTEMBRE: 9,
  OCTOBRE: 10,
  NOVEMBRE: 11,
  DECEMBRE: 12,
  DÉCEMBRE: 12,
}

export type SheetMonth = {
  year: number
  month: number
  monthKey: string
  exercice: string
  occurredAt: Date
}

/** Parse "OCTOBRE 25", "OCTOBRE 26", "OCTOBRE 2627" → calendar month. */
export function parseSheetMonth(sheetName: string): SheetMonth | null {
  const raw = sheetName.trim().toUpperCase().normalize('NFD').replace(/\p{M}/gu, '')
  if (raw === 'TOTAL' || raw === 'SAISIE') return null
  const match = raw.match(/^([A-Z]+)[\s_]+(\d{2})(\d{2})?$/)
  if (!match) return null
  const monthNum = MONTHS[match[1] ?? '']
  if (!monthNum) return null
  const yy = Number(match[2])
  const year = 2000 + yy
  const monthKey = `${year}-${String(monthNum).padStart(2, '0')}`
  const exerciceStart = monthNum >= 10 ? yy : yy - 1
  const exercice = `${String(exerciceStart).padStart(2, '0')}/${String(exerciceStart + 1).padStart(2, '0')}`
  return {
    year,
    month: monthNum,
    monthKey,
    exercice,
    occurredAt: new Date(Date.UTC(year, monthNum - 1, 1)),
  }
}
