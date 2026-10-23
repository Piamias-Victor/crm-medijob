import { z } from 'zod'
import { protectedProcedure } from '@/server/trpc'
import { idSchema } from '@/lib/schemas/entity-id'
import { linkSponsor } from '@/server/sponsorship/link-sponsor'
import { unlinkSponsor } from '@/server/sponsorship/unlink-sponsor'
import { mapSponsorshipLinkError } from '@/server/sponsorship/map-link-error'
import { makeSponsorshipLinkDeps } from '@/server/db/repositories/sponsorship.repository'
import { sponsorshipReadRepository } from '@/server/db/repositories/sponsorship-read.repo'
import { CANDIDATE_STATUS_LABELS } from '@/lib/candidate-status-options'

const linkSchema = z.object({
  filleuleId: z.string().min(1),
  sponsorId: z.string().min(1),
  confirmTransfer: z.boolean().optional(),
})

export function candidateSponsorshipRoutes() {
  const deps = makeSponsorshipLinkDeps('candidate')
  return {
    getSponsorship: protectedProcedure.input(idSchema).query(async ({ input }) =>
      sponsorshipReadRepository.candidateView(input.id),
    ),
    searchSponsorship: protectedProcedure
      .input(z.object({ query: z.string(), excludeId: z.string().min(1) }))
      .query(async ({ input }) => {
        const rows = await sponsorshipReadRepository.searchCandidates(
          input.query,
          input.excludeId,
        )
        return rows.map((r) => {
          const name = `${r.firstName} ${r.lastName}`.trim()
          return {
            id: r.id,
            name,
            status: r.status,
            label: `${name} · ${CANDIDATE_STATUS_LABELS[r.status]}`,
          }
        })
      }),
    linkSponsor: protectedProcedure.input(linkSchema).mutation(async ({ ctx, input }) => {
      try {
        await linkSponsor(input, ctx.session.user.id, deps)
      } catch (error) {
        mapSponsorshipLinkError(error)
      }
    }),
    unlinkSponsor: protectedProcedure
      .input(z.object({ filleuleId: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        try {
          await unlinkSponsor(input, ctx.session.user.id, deps)
        } catch (error) {
          mapSponsorshipLinkError(error)
        }
      }),
  }
}
