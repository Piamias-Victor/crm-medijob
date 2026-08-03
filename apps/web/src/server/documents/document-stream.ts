type DocumentRecord = {
  name: string
  url: string
  mimeType: string | null
}

type BlobStream = {
  stream: ReadableStream<Uint8Array>
  contentType: string
}

export type DocumentStreamDeps = {
  findById: (id: string) => Promise<DocumentRecord | null>
  fetchBlob: (url: string) => Promise<BlobStream | null>
}

export function documentContentDisposition(
  mode: 'inline' | 'attachment',
  filename: string,
) {
  return `${mode}; filename*=UTF-8''${encodeURIComponent(filename)}`
}

export async function loadDocumentStream(id: string, deps: DocumentStreamDeps) {
  const doc = await deps.findById(id)
  if (!doc) return { status: 404 as const }

  const blob = await deps.fetchBlob(doc.url)
  if (!blob) return { status: 404 as const }

  return {
    status: 200 as const,
    stream: blob.stream,
    contentType: doc.mimeType ?? blob.contentType ?? 'application/octet-stream',
    filename: doc.name,
  }
}
