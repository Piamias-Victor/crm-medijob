import { router, protectedProcedure } from '@/server/trpc'
import { chatInputSchema, searchInputSchema } from '@/server/ai/request'
import type { ChatInput } from '@/server/ai/request'
import type { AssistantResult } from '@/server/ai/chat-handler'
import { mapAssistantChatError } from '@/server/ai/router-errors'
import { runAssistantChat } from '@/server/ai/chat-handler'
import { searchEntities } from '@/server/ai/search'
import type { EntityOption } from '@/server/ai/search'
import type { ShortcutEntityType } from '@/server/ai/shortcuts'
import { createAssistantProvider } from '@/server/ai/provider'
import { candidateRepository } from '@/server/db/repositories/candidate.repository'
import { pharmacyRepository } from '@/server/db/repositories/pharmacy.repository'
import { missionRepository } from '@/server/db/repositories/mission.repository'

const repos = {
  candidate: candidateRepository,
  pharmacy: pharmacyRepository,
  mission: missionRepository,
}

export type AssistantRouterDeps = {
  runChat: (input: ChatInput) => Promise<AssistantResult>
  searchEntities: (entityType: ShortcutEntityType, term: string) => Promise<EntityOption[]>
}

export function makeAssistantRouter(deps: AssistantRouterDeps) {
  return router({
    chat: protectedProcedure.input(chatInputSchema).mutation(async ({ input }) => {
      try {
        return await deps.runChat(input)
      } catch (error) {
        throw mapAssistantChatError(error)
      }
    }),
    searchEntities: protectedProcedure
      .input(searchInputSchema)
      .query(({ input }) => deps.searchEntities(input.entityType, input.term)),
  })
}

export const assistantRouter = makeAssistantRouter({
  runChat: (input) =>
    runAssistantChat(input, { provider: createAssistantProvider(), repos }),
  searchEntities: (entityType, term) => searchEntities(entityType, term, repos),
})
