import { toScrapeDepartment } from '@/view-models/pharmacy-scrape-department'
import {
  isValidScrapeEmail,
  normalizeScrapeEmail,
  normalizeScrapeProvenance,
  scrapeRowKey,
  type PharmacyScrapeMappedRow,
} from '@/view-models/pharmacy-scrape-normalize'

export type EdithRawRow = {
  Provenance?: string
  Date?: string | number | Date
  Nom?: string
  CP?: string | number | Date
  Ville?: string
  Mail?: string
}

export type PharmacyScrapeSkip = { row: number; reason: string }

export type MapPharmacyScrapeResult = {
  rows: PharmacyScrapeMappedRow[]
  skipped: PharmacyScrapeSkip[]
}

function cell(v: string | number | Date | undefined): string {
  if (v == null) return ''
  if (v instanceof Date) return v.toISOString()
  return String(v).trim()
}

/** Excel serial day → Date (UTC noon). */
export function parseScrapeDate(raw: string | number | Date | undefined): Date | null {
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) return raw
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    const utc = Date.UTC(1899, 11, 30) + raw * 86400000
    return new Date(utc)
  }
  const s = cell(raw)
  if (!s) return null
  const asNum = Number(s)
  if (s !== '' && Number.isFinite(asNum) && /^\d+(\.0)?$/.test(s)) {
    return parseScrapeDate(asNum)
  }
  const d = new Date(s)
  return Number.isNaN(d.getTime()) ? null : d
}

export function mapPharmacyScrapeEdithRows(rawRows: EdithRawRow[]): MapPharmacyScrapeResult {
  const skipped: PharmacyScrapeSkip[] = []
  const byKey = new Map<string, PharmacyScrapeMappedRow>()

  rawRows.forEach((raw, index) => {
    const row = index + 2
    const emailRaw = cell(raw.Mail)
    const email = normalizeScrapeEmail(emailRaw)
    if (!email || !isValidScrapeEmail(email)) {
      skipped.push({ row, reason: 'Email invalide' })
      return
    }
    const provenance = normalizeScrapeProvenance(cell(raw.Provenance))
    if (!provenance) {
      skipped.push({ row, reason: 'Provenance manquante' })
      return
    }
    const name = cell(raw.Nom)
    if (!name) {
      skipped.push({ row, reason: 'Nom manquant' })
      return
    }
    const scrapedAt = parseScrapeDate(raw.Date) ?? new Date(0)
    const mapped: PharmacyScrapeMappedRow = {
      provenance,
      scrapedAt,
      name,
      department: toScrapeDepartment(cell(raw.CP)),
      city: cell(raw.Ville) || null,
      email,
    }
    byKey.set(scrapeRowKey(mapped.email, mapped.provenance), mapped)
  })

  return { rows: [...byKey.values()], skipped }
}
