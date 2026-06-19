import { CONTRACT_TYPES } from '@/view-models/candidate-profile.schema'

function asString(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function asOptionalString(value: unknown) {
  if (value == null) return undefined
  const text = asString(value)
  return text || undefined
}

function asOptionalEmail(value: unknown) {
  const text = asOptionalString(value)
  if (!text) return undefined
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text) ? text.toLowerCase() : undefined
}

function asIsoDateTime(value: unknown) {
  const text = asOptionalString(value)
  if (!text) return undefined
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return `${text}T00:00:00.000Z`
  return text
}

function filterContractTypes(value: unknown) {
  if (!Array.isArray(value)) return undefined
  const filtered = value.filter(
    (item): item is (typeof CONTRACT_TYPES)[number] =>
      typeof item === 'string' && CONTRACT_TYPES.includes(item as (typeof CONTRACT_TYPES)[number]),
  )
  return filtered.length > 0 ? filtered : undefined
}

function asStringArray(value: unknown) {
  if (!Array.isArray(value)) return undefined
  const items = value.map((item) => asString(item)).filter(Boolean)
  return items.length > 0 ? items : undefined
}

export function normalizeCvExtractionJson(json: unknown) {
  if (!json || typeof json !== 'object') return json
  const data = json as Record<string, unknown>

  return {
    ...data,
    firstName: asString(data.firstName),
    lastName: asString(data.lastName),
    email: asOptionalEmail(data.email),
    phone: asOptionalString(data.phone),
    address: asOptionalString(data.address),
    city: asOptionalString(data.city),
    postalCode: asOptionalString(data.postalCode),
    jobTitle: asOptionalString(data.jobTitle),
    softwares: asStringArray(data.softwares),
    preferredContractTypes: filterContractTypes(data.preferredContractTypes),
    availableFrom: asIsoDateTime(data.availableFrom),
    mobilityNotes: asOptionalString(data.mobilityNotes),
    profileSummary:
      asOptionalString(data.profileSummary) ?? asOptionalString(data.experienceNotes),
    rawText: asOptionalString(data.rawText),
  }
}
