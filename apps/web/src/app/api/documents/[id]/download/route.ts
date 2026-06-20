import { auth } from '@/server/auth'
import { documentRepository } from '@/server/db/repositories/document.repository'
import { fetchBlobStream, vercelBlobClient } from '@/server/services/blob'

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: Params) {
  const session = await auth()
  if (!session?.user) return new Response('Unauthorized', { status: 401 })

  const { id } = await params
  const doc = await documentRepository.findById(id)
  if (!doc) return new Response('Not found', { status: 404 })

  const blob = await fetchBlobStream(vercelBlobClient, doc.url)
  if (!blob) return new Response('Not found', { status: 404 })

  return new Response(blob.stream, {
    headers: {
      'Content-Type': doc.mimeType ?? blob.contentType ?? 'application/octet-stream',
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(doc.name)}`,
    },
  })
}
