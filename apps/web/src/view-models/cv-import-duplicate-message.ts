import { duplicateReasonLabel } from '@/lib/candidate-duplicate-copy'
import type { DuplicateMatch } from '@/server/candidate/detect-duplicate.types'

export function cvImportDuplicateToastMessage(matches: DuplicateMatch[]): string | null {
  if (matches.length === 0) return null
  const first = matches[0]
  if (!first) return null
  const reason = duplicateReasonLabel(first.reason)
  if (matches.length === 1) {
    return `Doublon détecté (${reason}) : ${first.firstName} ${first.lastName}. Vérifie avant de créer.`
  }
  return `${matches.length} doublons possibles (ex. ${reason}). Vérifie avant de créer.`
}
