import { TRPCError } from '@trpc/server'

const MESSAGES: Record<string, { code: 'BAD_REQUEST' | 'NOT_FOUND' | 'CONFLICT'; message: string }> =
  {
    SPONSORSHIP_SELF: { code: 'BAD_REQUEST', message: 'Une entité ne peut pas se parrainer elle-même' },
    SPONSORSHIP_CYCLE: { code: 'BAD_REQUEST', message: 'Ce lien créerait un cycle de parrainage' },
    SPONSORSHIP_NOT_FOUND: { code: 'NOT_FOUND', message: 'Pharmacie ou candidat introuvable' },
    SPONSORSHIP_TRANSFER_REQUIRED: {
      code: 'CONFLICT',
      message: 'SPONSORSHIP_TRANSFER_REQUIRED',
    },
  }

export function mapSponsorshipLinkError(error: unknown): never {
  const key = error instanceof Error ? error.message : ''
  const mapped = MESSAGES[key]
  if (mapped) throw new TRPCError(mapped)
  throw error
}
