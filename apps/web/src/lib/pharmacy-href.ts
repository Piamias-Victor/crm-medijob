const PHARMACY_BACK_PATH = /^\/pharmacies(?:\?.*)?$/

export function buildPharmacyReturnPath(pathname: string, search: string): string {
  return search ? `${pathname}?${search}` : pathname
}

export function pharmacyDetailHref(pharmacyId: string, returnPath: string): string {
  return `/pharmacies/${pharmacyId}?back=${encodeURIComponent(returnPath)}`
}

export function parsePharmacyBackHref(back: string | null | undefined): string {
  if (!back) return '/pharmacies'
  try {
    const decoded = decodeURIComponent(back)
    return PHARMACY_BACK_PATH.test(decoded) ? decoded : '/pharmacies'
  } catch {
    return '/pharmacies'
  }
}
