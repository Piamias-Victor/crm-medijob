export type InterviewMappingField =
  | 'availableFrom'
  | 'mobilityRadiusKm'
  | 'salaryExpectations'
  | 'notes'
  | 'softwareNames'
  | 'contractTypes'

export type InterviewMappingKind = 'fill' | 'overwrite'

export type InterviewMappingDiff = {
  field: InterviewMappingField
  kind: InterviewMappingKind
  current: unknown
  next: unknown
}

export type InterviewMappingProfile = {
  availableFrom: Date | null
  mobilityRadiusKm: number | null
  salaryExpectations: string | null
  notes: string | null
  softwareNames: string[]
  contractTypes: string[]
}

export function isMappingEmpty(value: unknown): boolean {
  if (value == null) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  return false
}
