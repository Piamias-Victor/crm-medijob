import { auth } from '@/server/auth'
import { candidateRepository } from '@/server/db/repositories/candidate.repository'
import { loadCandidateCvStream } from '@/server/candidates/cv-download'
import { fetchBlobStream, vercelBlobClient } from '@/server/services/blob'

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: Params) {
  const session = await auth()
  if (!session?.user) return new Response('Unauthorized', { status: 401 })

  const { id } = await params
  const result = await loadCandidateCvStream(id, {
    findCvUrl: async (candidateId) => {
      const candidate = await candidateRepository.findById(candidateId)
      return candidate ? { cvUrl: candidate.cvUrl } : null
    },
    fetchBlob: (url) => fetchBlobStream(vercelBlobClient, url),
  })

  if (result.status !== 200) return new Response('Not found', { status: 404 })

  return new Response(result.stream, {
    headers: {
      'Content-Type': result.contentType,
      'Content-Disposition': `inline; filename*=UTF-8''${encodeURIComponent(result.filename)}`,
    },
  })
}
