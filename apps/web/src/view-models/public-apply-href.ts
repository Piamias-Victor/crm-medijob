import type { JobOfferStatus } from '@prisma/client'

export function publicApplyPath(boardListingId: string): string {
  return `/postuler/${boardListingId}`
}

export function publicApplyUrl(baseUrl: string, boardListingId: string): string {
  return `${baseUrl.replace(/\/$/, '')}${publicApplyPath(boardListingId)}`
}

export function spontaneousApplyPath(): string {
  return '/postuler'
}

export function spontaneousApplyUrl(baseUrl: string): string {
  return `${baseUrl.replace(/\/$/, '')}${spontaneousApplyPath()}`
}

export function canShowPublicApplyLink(input: {
  status: JobOfferStatus
  boardListingId: string | null | undefined
}): boolean {
  return input.status === 'PUBLIEE' && Boolean(input.boardListingId?.trim())
}
