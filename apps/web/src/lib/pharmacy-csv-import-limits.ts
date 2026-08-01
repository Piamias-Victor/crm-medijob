export const PHARMACY_CSV_MAX_BYTES = 5 * 1024 * 1024
export const PHARMACY_CSV_MAX_ROWS = 2000

export function pharmacyCsvSizeError(byteLength: number): string | null {
  if (byteLength > PHARMACY_CSV_MAX_BYTES) {
    return 'Fichier trop volumineux (max 5 Mo).'
  }
  return null
}
