export const CANDIDATE_CSV_MAX_BYTES = 5 * 1024 * 1024
export const CANDIDATE_CSV_MAX_ROWS = 2000

export function candidateCsvSizeError(byteLength: number): string | null {
  if (byteLength > CANDIDATE_CSV_MAX_BYTES) {
    return 'Fichier trop volumineux (max 5 Mo).'
  }
  return null
}
