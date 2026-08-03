import {
  documentContentDisposition,
  loadDocumentStream,
  type DocumentStreamDeps,
} from '@/server/documents/document-stream'

type AuthSession = { user?: unknown } | null

export async function documentFileResponse(input: {
  id: string
  disposition: 'inline' | 'attachment'
  session: AuthSession
  deps: DocumentStreamDeps
}) {
  if (!input.session?.user) return new Response('Unauthorized', { status: 401 })

  const result = await loadDocumentStream(input.id, input.deps)
  if (result.status !== 200) return new Response('Not found', { status: 404 })

  return new Response(result.stream, {
    headers: {
      'Content-Type': result.contentType,
      'Content-Disposition': documentContentDisposition(input.disposition, result.filename),
    },
  })
}
