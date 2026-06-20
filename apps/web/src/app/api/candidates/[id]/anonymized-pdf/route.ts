import { auth } from '@/server/auth'
import { candidateRepository } from '@/server/db/repositories/candidate.repository'
import { loadAnonymizedProfilePdf } from '@/server/candidates/anonymized-pdf-download'
import { renderAnonymizedProfilePdf } from '@/server/pdf/render-anonymized-profile'

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: Params) {
  const session = await auth()
  if (!session?.user) return new Response('Unauthorized', { status: 401 })

  const { id } = await params
  const result = await loadAnonymizedProfilePdf(id, {
    findAnonymizedProfile: async (candidateId) => {
      const candidate = await candidateRepository.findById(candidateId)
      return candidate
        ? { anonymizedProfile: candidate.anonymizedProfile }
        : null
    },
  })

  if (result.status !== 200) return new Response('Not found', { status: 404 })

  const buffer = await renderAnonymizedProfilePdf(result.content)
  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(`dossier-${id}.pdf`)}`,
    },
  })
}
