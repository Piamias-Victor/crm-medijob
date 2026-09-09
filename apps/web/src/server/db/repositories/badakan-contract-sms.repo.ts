import type { PrismaClient } from '@prisma/client'
import {
  contractSignSmsReminderCutoff,
  type SmsDueKind,
} from '@/view-models/badakan-contract-sms'
import type { ContractSmsDueRow } from '@/server/badakan-contract-sms/send-due.types'
import { attachContractSmsCandidates } from './badakan-contract-sms.attach'

const contractSelect = { id: true, recipientId: true } as const

function createdWithRecipient() {
  return { status: 'CREATED' as const, recipientId: { not: null } }
}

export function makeBadakanContractSmsRepository(db: PrismaClient) {
  return {
    listDue: async (now: Date = new Date()): Promise<ContractSmsDueRow[]> => {
      const first = await db.badakanContract.findMany({
        where: { ...createdWithRecipient(), signInviteSmsSentAt: null },
        select: contractSelect,
      })
      const reminder = await db.badakanContract.findMany({
        where: {
          ...createdWithRecipient(),
          signInviteSmsSentAt: { lte: contractSignSmsReminderCutoff(now) },
          signInviteReminderSentAt: null,
        },
        select: contractSelect,
      })
      return [
        ...(await attachContractSmsCandidates(db, first, 'first')),
        ...(await attachContractSmsCandidates(db, reminder, 'reminder')),
      ]
    },
    markSent: async (contractId: string, kind: SmsDueKind) => {
      await db.badakanContract.update({
        where: { id: contractId },
        data:
          kind === 'reminder'
            ? { signInviteReminderSentAt: new Date() }
            : { signInviteSmsSentAt: new Date() },
      })
    },
  }
}
