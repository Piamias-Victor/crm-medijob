import type { PrismaClient } from '@prisma/client'
import { NOT_DELETED } from './soft-delete'
import type { SmsDueKind } from '@/view-models/badakan-contract-sms'
import type { ContractSmsDueRow } from '@/server/badakan-contract-sms/send-due.types'

const smsExcludedStatus = ['INACTIF', 'BLACKLISTE'] as const
const candidateSelect = { id: true, badakanId: true, phone: true } as const

type ContractRow = { id: string; recipientId: string | null }

export async function attachContractSmsCandidates(
  db: PrismaClient,
  rows: ContractRow[],
  kind: SmsDueKind,
): Promise<ContractSmsDueRow[]> {
  const ids = [
    ...new Set(rows.flatMap((row) => (row.recipientId ? [row.recipientId] : []))),
  ]
  if (ids.length === 0) return []
  const candidates = await db.candidate.findMany({
    where: {
      ...NOT_DELETED,
      badakanId: { in: ids },
      status: { notIn: [...smsExcludedStatus] },
    },
    select: candidateSelect,
  })
  const byBadakan = new Map(candidates.map((row) => [row.badakanId, row]))
  return rows.flatMap((row) => {
    const candidate = row.recipientId ? byBadakan.get(row.recipientId) : undefined
    if (!candidate) return []
    return [
      {
        contractId: row.id,
        candidateId: candidate.id,
        phone: candidate.phone,
        kind,
      },
    ]
  })
}
