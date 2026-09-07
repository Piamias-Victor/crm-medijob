import type { BadakanRecipient } from '@/server/badakan/map-recipient'

export function mergeBadakanRecipients(
  ...lists: BadakanRecipient[][]
): BadakanRecipient[] {
  const byId = new Map<string, BadakanRecipient>()
  for (const list of lists) {
    for (const row of list) byId.set(row.badakanId, row)
  }
  return [...byId.values()]
}
