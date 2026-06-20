import type { ResponseKind } from './schemas'

export type AssistantRequest = { prompt: string; kind: ResponseKind | 'matching' }

export interface AssistantProvider {
  complete(request: AssistantRequest): Promise<string>
}
