import type { AnonymizedDossier } from '@/view-models/anonymized-dossier.schema'
import { ANONYMIZED_DOSSIER_KEYS } from '@/view-models/anonymized-dossier.schema'
import { assertAnonymizedProfileSafe } from '@/server/ai/candidate-anonymized-pii'

export function anonymizedDossierPlainText(dossier: AnonymizedDossier): string {
  return ANONYMIZED_DOSSIER_KEYS.map((key) => dossier[key]).join('\n')
}

export function assertAnonymizedDossierSafe(
  dossier: AnonymizedDossier,
  forbiddenTokens: string[],
): void {
  assertAnonymizedProfileSafe({
    profile: anonymizedDossierPlainText(dossier),
    forbiddenTokens,
  })
}
