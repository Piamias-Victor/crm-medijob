const CONTACT_BACK_PATH = /^\/contacts(?:\?.*)?$/

export function buildContactReturnPath(pathname: string, search: string): string {
  return search ? `${pathname}?${search}` : pathname
}

export function contactDetailHref(contactId: string, returnPath: string): string {
  return `/contacts/${contactId}?back=${encodeURIComponent(returnPath)}`
}

export function parseContactBackHref(back: string | null | undefined): string {
  if (!back) return '/contacts'
  try {
    const decoded = decodeURIComponent(back)
    return CONTACT_BACK_PATH.test(decoded) ? decoded : '/contacts'
  } catch {
    return '/contacts'
  }
}
