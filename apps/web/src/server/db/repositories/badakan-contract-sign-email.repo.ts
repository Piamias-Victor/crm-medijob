import type { PrismaClient } from '@prisma/client'
import type { ContractSignEmailDueRow } from '@/server/pharmacy-contract-email/send-due.types'
import { attachContractSignEmailRecipients } from './badakan-contract-sign-email.attach'

const dueSelect = { id: true, enterpriseId: true } as const

export function makeBadakanContractSignEmailRepository(db: PrismaClient) {
  return {
    listDue: async (): Promise<ContractSignEmailDueRow[]> => {
      const pending = await db.badakanContract.findMany({
        where: {
          status: 'CREATED',
          signInviteEmailSentAt: null,
          enterpriseId: { not: null },
        },
        select: dueSelect,
      })
      if (pending.length === 0) return []
      return attachContractSignEmailRecipients(db, pending)
    },
    markSent: async (contractId: string) => {
      await db.badakanContract.update({
        where: { id: contractId },
        data: { signInviteEmailSentAt: new Date() },
      })
    },
  }
}
