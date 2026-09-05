import { isBadakanInactive } from '@/server/badakan/map-recipient-status'
import type { BadakanRecipient } from '@/server/badakan/map-recipient'

export type ProbeInactiveDeps = {
  listLinked: () => Promise<string[]>
  getRecipient: (badakanId: string) => Promise<BadakanRecipient | null>
}

export async function probeInactiveRecipients(
  completed: BadakanRecipient[],
  deps: ProbeInactiveDeps,
): Promise<BadakanRecipient[]> {
  const present = new Set(completed.map((row) => row.badakanId))
  const extra: BadakanRecipient[] = []
  for (const badakanId of await deps.listLinked()) {
    if (present.has(badakanId)) continue
    const row = await deps.getRecipient(badakanId)
    if (row && isBadakanInactive(row.status)) extra.push(row)
  }
  return extra
}
