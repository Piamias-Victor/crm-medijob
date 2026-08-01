import { REFERENT_NONE } from '@/lib/constants/referent-none'

export function buildReferentIdWhere(referentIds: string[]): {
  referentId: null
} | {
  referentId: { in: string[] }
} | {
  OR: Array<{ referentId: null } | { referentId: { in: string[] } }>
} {
  const wantsNone = referentIds.includes(REFERENT_NONE)
  const ids = referentIds.filter((id) => id !== REFERENT_NONE)

  if (wantsNone && ids.length > 0) {
    return { OR: [{ referentId: null }, { referentId: { in: ids } }] }
  }
  if (wantsNone) return { referentId: null }
  return { referentId: { in: ids } }
}
