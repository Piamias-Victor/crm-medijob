/** Taux remplissage = POURVU / (toutes missions hors ANNULEE), en %. */
export function computeFillRate(pourvu: number, eligible: number): number {
  if (eligible <= 0) return 0
  return Math.round((pourvu / eligible) * 100)
}
