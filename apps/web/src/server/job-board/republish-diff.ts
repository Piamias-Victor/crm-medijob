import { BOARD_ENTREPRISE } from '@/server/job-board/format-board-offer'
import { OFFER_SECTION_TITLES } from '@/server/job-board/offer-section-titles'
import type { BoardListing } from '@/server/job-board/port'

export type RepublishCandidate = {
  offerId: string
  boardListingId: string
  reasons: string[]
}

export function missingSectionTitles(content: string): string[] {
  return OFFER_SECTION_TITLES.filter((title) => !content.includes(title))
}

export function listingRepublishReasons(
  currentContent: string,
  next: BoardListing,
): string[] {
  const reasons: string[] = []
  if (next.entreprise !== BOARD_ENTREPRISE) reasons.push('entreprise')
  const missing = missingSectionTitles(currentContent)
  if (missing.length) reasons.push(`sections:${missing.length}`)
  if (missingSectionTitles(next.description).length === 0 && missing.length) {
    reasons.push('description-will-gain-sections')
  }
  return reasons
}

export function toRepublishCandidate(
  offerId: string,
  boardListingId: string,
  reasons: string[],
): RepublishCandidate | null {
  if (!reasons.length) return null
  return { offerId, boardListingId, reasons }
}

export function formatDryRunSummary(candidates: RepublishCandidate[]) {
  return {
    count: candidates.length,
    byReason: candidates.reduce<Record<string, number>>((acc, row) => {
      for (const reason of row.reasons) {
        acc[reason] = (acc[reason] ?? 0) + 1
      }
      return acc
    }, {}),
    sampleIds: candidates.slice(0, 5).map((row) => row.offerId.slice(0, 8)),
  }
}
