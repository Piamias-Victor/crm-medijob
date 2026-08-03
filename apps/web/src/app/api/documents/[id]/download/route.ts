import { auth } from '@/server/auth'
import { documentRepository } from '@/server/db/repositories/document.repository'
import { documentFileResponse } from '@/server/documents/document-file-response'
import { fetchBlobStream, vercelBlobClient } from '@/server/services/blob'

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: Params) {
  const session = await auth()
  const { id } = await params
  return documentFileResponse({
    id,
    disposition: 'attachment',
    session,
    deps: {
      findById: (docId) => documentRepository.findById(docId),
      fetchBlob: (url) => fetchBlobStream(vercelBlobClient, url),
    },
  })
}
