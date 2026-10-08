import { uploadBlob, type BlobClient } from '@/server/services/blob'

function filenameFromUrl(url: string) {
  try {
    const path = new URL(url).pathname
    const last = path.split('/').filter(Boolean).at(-1)
    return last && last.includes('.') ? last : 'cv.pdf'
  } catch {
    return 'cv.pdf'
  }
}

async function streamToBuffer(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader()
  const chunks: Uint8Array[] = []
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    if (value) chunks.push(value)
  }
  return Buffer.concat(chunks)
}

export async function copyRemoteCvToBlob(
  sourceUrl: string,
  applicationId: string,
  client: BlobClient,
  fetchFn: typeof fetch = fetch,
): Promise<string | null> {
  const pathname = `candidate/application/${applicationId}/${filenameFromUrl(sourceUrl)}`

  const privateBlob = await client.getStream(sourceUrl)
  if (privateBlob) {
    const body = await streamToBuffer(privateBlob.stream)
    const uploaded = await uploadBlob(client, {
      pathname,
      body,
      contentType: privateBlob.contentType || 'application/pdf',
    })
    return uploaded.url
  }

  const res = await fetchFn(sourceUrl)
  if (!res.ok) return null
  const body = Buffer.from(await res.arrayBuffer())
  const contentType = res.headers.get('content-type') ?? 'application/pdf'
  const uploaded = await uploadBlob(client, { pathname, body, contentType })
  return uploaded.url
}
