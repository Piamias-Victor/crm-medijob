import type { CvExtraction, CvExtractionAi } from '@/server/ai/cv-extraction.schema'

const PLACEHOLDERS = new Set(['n/a', 'na', 'null', 'none', '-', 'inconnu', 'non identifié'])

export function isExtractedPlaceholder(value?: string | null) {
  if (!value?.trim()) return true
  return PLACEHOLDERS.has(
    value
      .normalize('NFD')
      .replace(/\p{M}/gu, '')
      .toLowerCase()
      .trim(),
  )
}

function pickValue(current: string | undefined, found: string | undefined) {
  if (!found) return current
  if (isExtractedPlaceholder(current)) return found
  return current
}

function findEmail(text: string) {
  return text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0]?.toLowerCase()
}

function findPhone(text: string) {
  return text.match(/(?:\+33\s?[1-9]|0[1-9])(?:[\s.-]?\d{2}){4}/)?.[0]?.trim()
}

function findPostalCode(text: string) {
  return text.match(/\b(?:0[1-9]|[1-8]\d|9[0-8])\d{3}\b/)?.[0]
}

function findCity(text: string, postalCode?: string) {
  if (!postalCode) return undefined
  const pattern = new RegExp(`\\b${postalCode}\\b\\s+([A-Za-zÀ-ÿ'\\- ]{2,40})`)
  return text.match(pattern)?.[1]?.trim()
}

export function enrichCvExtraction(extraction: CvExtractionAi): CvExtraction {
  const rawText = extraction.rawText ?? ''
  const postalCode = pickValue(extraction.postalCode, findPostalCode(rawText))

  const { rawText: _ignored, ...rest } = extraction
  return {
    ...rest,
    email: pickValue(extraction.email, findEmail(rawText)),
    phone: pickValue(extraction.phone, findPhone(rawText)),
    postalCode,
    city: pickValue(extraction.city, findCity(rawText, postalCode)),
    address: pickValue(extraction.address, undefined),
  }
}
