import { router, protectedProcedure } from '@/server/trpc'
import { toBadakanContractListItems } from '@/view-models/badakan-contract-list'
import {
  defaultBadakanContractDeps,
  type BadakanContractDeps,
} from './badakan-contract.deps'

export function makeBadakanContractRouter(deps: BadakanContractDeps) {
  return router({
    list: protectedProcedure.query(async () =>
      toBadakanContractListItems(await deps.list()),
    ),
  })
}

export const badakanContractRouter = makeBadakanContractRouter(defaultBadakanContractDeps)
