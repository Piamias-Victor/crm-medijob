import { TRPCError } from '@trpc/server'
import { router, protectedProcedure } from '@/server/trpc'
import { chatInputSchema, searchInputSchema } from '@/server/ai/request'
import { runAssistantChat } from '@/server/ai/chat-handler'
import { searchEntities } from '@/server/ai/search'
import { createAssistantProvider } from '@/server/ai/provider'
import { candidateRepository } from '@/server/db/repositories/candidate.repository'
import { pharmacyRepository } from '@/server/db/repositories/pharmacy.repository'
import { missionRepository } from '@/server/db/repositories/mission.repository'

const repos = {
  candidate: candidateRepository,
  pharmacy: pharmacyRepository,
  mission: missionRepository,
}

export const assistantRouter = router({
  chat: protectedProcedure.input(chatInputSchema).mutation(async ({ input }) => {
    try {
      return await runAssistantChat(input, { provider: createAssistantProvider(), repos })
    } catch {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Réponse IA invalide ou indisponible. Réessaie.',
      })
    }
  }),

  searchEntities: protectedProcedure
    .input(searchInputSchema)
    .query(({ input }) => searchEntities(input.entityType, input.term, repos)),
})
