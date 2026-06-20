import { TRPCError } from '@trpc/server'
import { ZodError } from 'zod'

const KNOWN_ERRORS: Record<string, { code: TRPCError['code']; message: string }> = {
  UNKNOWN_SHORTCUT: { code: 'NOT_FOUND', message: 'Raccourci inconnu.' },
  AI_RESPONSE_NOT_JSON: {
    code: 'BAD_REQUEST',
    message: 'Réponse IA non valide. Réessaie.',
  },
  ANONYMIZED_CONTAINS_PII: {
    code: 'BAD_REQUEST',
    message: 'Le dossier anonymisé contient des données personnelles. Réessaie.',
  },
}

export function mapAssistantChatError(error: unknown): TRPCError {
  if (error instanceof TRPCError) return error
  if (error instanceof Error && error.message in KNOWN_ERRORS) {
    const mapped = KNOWN_ERRORS[error.message]
    return new TRPCError({ code: mapped.code, message: mapped.message })
  }
  if (error instanceof ZodError) {
    return new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Réponse IA non conforme au schéma.',
    })
  }
  return new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Assistant IA indisponible. Réessaie.',
  })
}
