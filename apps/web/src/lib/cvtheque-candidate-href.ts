const ALLOWED_BACK_PATHS = [
  /^\/candidats(?:\?.*)?$/,
  /^\/interim\/candidats(?:\?.*)?$/,
  /^\/interim\/disponibilites(?:\?.*)?$/,
]

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
    return ALLOWED_BACK_PATHS.some((re) => re.test(decoded)) ? decoded : '/candidats'
  } catch {
    return '/candidats'
  }
}

export function candidateBackLabel(backHref: string): string {
  if (backHref.startsWith('/interim/disponibilites')) return 'Disponibilités'
  if (backHref.startsWith('/interim/candidats')) return 'Intérim'
  return 'CVthèque'
}
