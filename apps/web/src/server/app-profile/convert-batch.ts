import type { BadakanRecipient } from '@/server/badakan/map-recipient'

export const APP_CONVERT_BATCH_LIMIT = 25

export type ConvertQueueItem = { badakanId: string; createdAt: Date }

export function orderConvertBatch(
  rows: BadakanRecipient[],
  pending: ConvertQueueItem[],
): BadakanRecipient[] {
  const createdAt = new Map(pending.map((row) => [row.badakanId, row.createdAt.getTime()]))
  const queued: BadakanRecipient[] = []
  const rest: BadakanRecipient[] = []
  for (const row of rows) {
    if (createdAt.has(row.badakanId)) queued.push(row)
    else rest.push(row)
  }
  queued.sort((a, b) => (createdAt.get(a.badakanId) ?? 0) - (createdAt.get(b.badakanId) ?? 0))
  return [...queued, ...rest]
}
