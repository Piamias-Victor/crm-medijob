import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { router, publicProcedure } from '@/server/trpc'
import { prisma } from '@/server/db/repositories/client'
import { uploadBlob } from '@/server/services/blob'
import { resolveBlobClient } from '@/server/services/resolve-blob-client'
import { makePublicApplyOfferRepo } from '@/server/public-apply/offer-repo'
import { makePublicApplyRateLimitRepo } from '@/server/public-apply/rate-limit-repo'
import { publicOfferView } from '@/server/public-apply/offer-card'
import { submitPublicApply } from '@/server/public-apply/submit'
import { publicApplyClientInputSchema } from '@/server/public-apply/submit-input'
import {
  getPublicApplyPrivacyUrl,
  getPublicApplyRetentionLabel,
} from '@/server/public-apply/privacy-env'

const offers = makePublicApplyOfferRepo(prisma)
const rate = makePublicApplyRateLimitRepo(prisma)

function mapSubmitError(code: string, message: string): never {
  if (code === 'NOT_FOUND') throw new TRPCError({ code: 'NOT_FOUND', message })
  if (code === 'RATE_LIMIT') throw new TRPCError({ code: 'TOO_MANY_REQUESTS', message })
  throw new TRPCError({ code: 'BAD_REQUEST', message })
}

export const publicApplyRouter = router({
  getOffer: publicProcedure
    .input(z.object({ boardListingId: z.string().min(1) }))
    .query(async ({ input }) => {
      const card = await offers.findByBoardListingId(input.boardListingId)
      if (!card) throw new TRPCError({ code: 'NOT_FOUND', message: 'Offre introuvable' })
      return {
        ...publicOfferView(card),
        privacyUrl: getPublicApplyPrivacyUrl(),
        retentionLabel: getPublicApplyRetentionLabel(),
      }
    }),
  submit: publicProcedure.input(publicApplyClientInputSchema).mutation(async ({ input, ctx }) => {
    const result = await submitPublicApply(
      {
        findOfferByListingId: (id) => offers.findByBoardListingId(id),
        consumeRateLimit: (ip) => rate.consume(ip),
        uploadCv: (payload) => uploadBlob(resolveBlobClient(), payload),
        createApplication: (data) =>
          prisma.application.create({
            data: { ...data, source: 'PUBLIC_APPLY', status: 'EN_ATTENTE' },
            select: { id: true },
          }),
        logHoneypot: () => console.info('[public-apply] honeypot blocked'),
      },
      { ...input, clientIp: ctx.clientIp ?? '0.0.0.0' },
    )
    if (!result.ok) mapSubmitError(result.code, result.message)
    return { ok: true as const }
  }),
})
