const CVTHEQUE_BACK_PATH = /^\/candidats(?:\?.*)?$/

export function buildCvthequeReturnPath(pathname: string, search: string): string {
  return search ? `${pathname}?${search}` : pathname
}

export function cvthequeCandidateHref(candidateId: string, returnPath: string): string {
  return `/candidats/${candidateId}?back=${encodeURIComponent(returnPath)}`
}

export function parseCvthequeBackHref(back: string | null | undefined): string {
  if (!back) return '/candidats'
  try {
    const decoded = decodeURIComponent(back)
    return CVTHEQUE_BACK_PATH.test(decoded) ? decoded : '/candidats'
  } catch {
    return '/candidats'
  }
}
