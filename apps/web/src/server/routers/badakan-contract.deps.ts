import { badakanContractRepository } from '@/server/db/repositories/badakan-contract.repository'

export type BadakanContractRecord = {
  id: string
  recipientName: string
  pharmacyName: string
  status: string
  pdfUrl: string | null
  dpaeUrl: string | null
}

export type BadakanContractDeps = {
  list: () => Promise<BadakanContractRecord[]>
}

export const defaultBadakanContractDeps: BadakanContractDeps = {
  list: () => badakanContractRepository.list(),
}
