/**
 * Efface une fiche origin App pour rejouer la création (IA comprise).
 * Usage: cd apps/web && pnpm exec tsx --env-file=.env src/server/app-profile/reset-app-candidate-cli.ts
 */
import { makeCandidateAppOriginRepository } from '@/server/db/repositories/candidate-app-origin.repo'
import { prisma } from '@/server/db/repositories/client'
import { userRepository } from '@/server/db/repositories/user.repository'
import { eraseCandidateGdpr } from '@/server/gdpr/erase-candidate'
import { makeEraseCandidateGdprDeps } from '@/server/gdpr/erase-candidate.deps'

const TOUNKARA_BADAKAN_ID = '6a94d9e7bedba3c1f32c2d05'

async function main() {
  const badakanId = process.env.BADAKAN_ID?.trim() || TOUNKARA_BADAKAN_ID
  const appOrigin = makeCandidateAppOriginRepository(prisma)
  const candidate = await appOrigin.findByBadakanId(badakanId)
  if (!candidate) {
    console.log(JSON.stringify({ badakanId, erased: false, reason: 'no_candidate' }, null, 2))
    return
  }

  const [admin] = await userRepository.list()
  if (!admin) throw new Error('no user available for the GDPR audit trail')

  await eraseCandidateGdpr(makeEraseCandidateGdprDeps(), {
    candidateId: candidate.id,
    erasedByUserId: admin.id,
    reason: `Reset test sync App-validated ${badakanId}`,
  })
  console.log(JSON.stringify({ badakanId, erased: true, candidateId: candidate.id }, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
