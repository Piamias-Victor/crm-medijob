import { responseSchemas, type ResponseKind } from './schemas'

export function parseAssistantResponse(kind: ResponseKind, raw: string): unknown {
  let json: unknown
  try {
    json = JSON.parse(raw)
  } catch {
    throw new Error('AI_RESPONSE_NOT_JSON')
  }
  return responseSchemas[kind].parse(json)
}
