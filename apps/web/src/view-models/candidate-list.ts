import type { RawCandidate } from '@/view-models/candidate-kanban.types'
import { toListItems, type CandidateListItem } from '@/view-models/candidate-kanban'

export type CandidateListRow = CandidateListItem

export function toCandidateListRow(candidate: RawCandidate): CandidateListRow {
  return toListItems([candidate])[0]!
}

export function toCandidateListRows(candidates: RawCandidate[]): CandidateListRow[] {
  return toListItems(candidates)
}
