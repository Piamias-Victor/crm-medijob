const MISSION_BACK_PATH = /^\/missions(?:\?.*)?$/

export function buildMissionReturnPath(pathname: string, search: string): string {
  return search ? `${pathname}?${search}` : pathname
}

export function missionDetailHref(missionId: string, returnPath: string): string {
  return `/missions/${missionId}?back=${encodeURIComponent(returnPath)}`
}

export function parseMissionBackHref(back: string | null | undefined): string {
  if (!back) return '/missions'
  try {
    const decoded = decodeURIComponent(back)
    return MISSION_BACK_PATH.test(decoded) ? decoded : '/missions'
  } catch {
    return '/missions'
  }
}
