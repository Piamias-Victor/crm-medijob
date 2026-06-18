import { describe, it, expect } from 'vitest'
import { TRPCError } from '@trpc/server'
import { ZodError, z } from 'zod'
import { mapAssistantChatError } from '@/server/ai/router-errors'

describe('mapAssistantChatError', () => {
  it('maps an unknown shortcut to NOT_FOUND', () => {
    const mapped = mapAssistantChatError(new Error('UNKNOWN_SHORTCUT'))
    expect(mapped.code).toBe('NOT_FOUND')
    expect(mapped.message).toContain('Raccourci')
  })

  it('maps invalid JSON from the provider to BAD_REQUEST', () => {
    const mapped = mapAssistantChatError(new Error('AI_RESPONSE_NOT_JSON'))
    expect(mapped.code).toBe('BAD_REQUEST')
  })

  it('maps a Zod validation failure to BAD_REQUEST', () => {
    const err = z.object({ summary: z.string().min(1) }).safeParse({ summary: '' }).error
    const mapped = mapAssistantChatError(err as ZodError)
    expect(mapped.code).toBe('BAD_REQUEST')
  })

  it('maps unexpected failures to INTERNAL_SERVER_ERROR', () => {
    const mapped = mapAssistantChatError(new Error('network down'))
    expect(mapped.code).toBe('INTERNAL_SERVER_ERROR')
  })

  it('rethrows an existing TRPCError unchanged', () => {
    const original = new TRPCError({ code: 'FORBIDDEN', message: 'nope' })
    expect(mapAssistantChatError(original)).toBe(original)
  })
})
