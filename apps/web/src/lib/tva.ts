// Calcul du numéro de TVA intracommunautaire français (SPEC_V2 §8).
// clé = (12 + 3 × (SIREN % 97)) % 97 → numeroTVA = FR + clé(2) + SIREN(9).

const SIREN_LENGTH = 9
const SIRET_LENGTH = 14

export function computeNumeroTVA(input: string): string | null {
  const digits = input.replace(/\s/g, '')
  if (!/^\d+$/.test(digits)) return null
  if (digits.length !== SIREN_LENGTH && digits.length !== SIRET_LENGTH) {
    return null
  }
  const siren = digits.slice(0, SIREN_LENGTH)
  const key = (12 + 3 * (Number(siren) % 97)) % 97
  return `FR${String(key).padStart(2, '0')}${siren}`
}
