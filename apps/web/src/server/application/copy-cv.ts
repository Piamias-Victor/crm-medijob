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

export async function copyRemoteCvToBlob(
  sourceUrl: string,
  applicationId: string,
  client: BlobClient,
  fetchFn: typeof fetch = fetch,
): Promise<string | null> {
  const res = await fetchFn(sourceUrl)
  if (!res.ok) return null
  const body = Buffer.from(await res.arrayBuffer())
  const contentType = res.headers.get('content-type') ?? 'application/pdf'
  const uploaded = await uploadBlob(client, {
    pathname: `candidate/application/${applicationId}/${filenameFromUrl(sourceUrl)}`,
    body,
    contentType,
  })
  return uploaded.url
}
