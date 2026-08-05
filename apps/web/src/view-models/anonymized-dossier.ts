import {
  ANONYMIZED_DOSSIER_KEYS,
  ANONYMIZED_DOSSIER_LABELS,
} from '@/view-models/anonymized-dossier.labels'
import {
  anonymizedDossierSchema,
  type AnonymizedDossier,
} from '@/view-models/anonymized-dossier.schema'

export type AnonymizedSection = {
  key: keyof AnonymizedDossier
  label: string
  content: string
}

export function serializeAnonymizedDossier(dossier: AnonymizedDossier): string {
  return JSON.stringify(anonymizedDossierSchema.parse(dossier))
}

export function parseAnonymizedDossier(raw: string | null | undefined): AnonymizedDossier | null {
  if (!raw?.trim()) return null
  try {
    return anonymizedDossierSchema.parse(JSON.parse(raw))
  } catch {
    return null
  }
}

export function nonEmptyAnonymizedSections(dossier: AnonymizedDossier): AnonymizedSection[] {
  return ANONYMIZED_DOSSIER_KEYS.filter((key) => dossier[key].trim()).map((key) => ({
    key,
    label: ANONYMIZED_DOSSIER_LABELS[key],
    content: dossier[key].trim(),
  }))
}

export function formatAnonymizedDossierExport(dossier: AnonymizedDossier): string {
  return nonEmptyAnonymizedSections(dossier)
    .map((section) => `${section.label}\n${section.content}`)
    .join('\n\n')
}

export function formatStoredAnonymizedDossierExport(raw: string | null | undefined): string {
  const dossier = parseAnonymizedDossier(raw)
  return dossier ? formatAnonymizedDossierExport(dossier) : ''
}

export function hasStructuredAnonymizedDossier(raw: string | null | undefined): boolean {
  return parseAnonymizedDossier(raw) !== null
}

export { emptyAnonymizedDossier } from '@/view-models/anonymized-dossier.labels'
export type { AnonymizedDossier }
