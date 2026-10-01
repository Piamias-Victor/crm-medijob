export const BOARD_ENTREPRISE = 'MEDIJOB'

export function formatBoardOfferTitle(jobTitleName: string): string {
  return jobTitleName.trim()
}

export function formatBoardOfferCity(city: string | null | undefined): string {
  const trimmed = city?.trim()
  return trimmed || 'Non précisée'
}
