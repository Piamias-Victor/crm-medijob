import type { InterviewMappingDiff, InterviewMappingField } from '@/view-models/interview-mapping-types'

export function mappingNextToInput(next: unknown): string {
  if (next instanceof Date) return next.toISOString().slice(0, 10)
  if (Array.isArray(next)) return next.join(', ')
  if (next == null) return ''
  return String(next)
}

export function mappingInputToNext(field: InterviewMappingField, value: string): unknown {
  const trimmed = value.trim()
  if (!trimmed) return undefined
  if (field === 'availableFrom') return new Date(`${trimmed}T00:00:00.000Z`)
  if (field === 'mobilityRadiusKm') {
    const parsed = Number(trimmed)
    return Number.isFinite(parsed) ? parsed : undefined
  }
  if (field === 'softwareNames' || field === 'contractTypes') {
    return trimmed.split(',').map((part) => part.trim()).filter(Boolean)
  }
  return trimmed
}

export function mappingInputType(field: InterviewMappingField): 'date' | 'number' | 'text' {
  if (field === 'availableFrom') return 'date'
  if (field === 'mobilityRadiusKm') return 'number'
  return 'text'
}

export function mappingDefaultInput(diff: InterviewMappingDiff): string {
  const next = mappingNextToInput(diff.next)
  const current = mappingNextToInput(diff.current)
  return diff.kind === 'overwrite' ? current || next : next || current
}

export function defaultMappingEdits(diffs: InterviewMappingDiff[]): Record<string, string> {
  return Object.fromEntries(diffs.map((diff) => [diff.field, mappingDefaultInput(diff)]))
}

export function defaultSavedFields(diffs: InterviewMappingDiff[]): string[] {
  return diffs.filter((diff) => diff.kind === 'fill').map((diff) => diff.field)
}

export function applyMappingEdits(
  diffs: InterviewMappingDiff[],
  edits: Record<string, string>,
): InterviewMappingDiff[] {
  return diffs.flatMap((diff) => {
    if (!(diff.field in edits)) return [diff]
    const next = mappingInputToNext(diff.field, edits[diff.field] ?? '')
    if (next === undefined) return []
    return [{ ...diff, next }]
  })
}
