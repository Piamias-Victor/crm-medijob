import type { ResumeFile } from './fetch-resume'

export async function downloadBadakanFile(
  fetchFn: typeof fetch,
  token: string,
  url: string,
  format: string | undefined,
  filenameStem: string,
): Promise<ResumeFile> {
  const res = await fetchFn(url, { headers: { security_token: token } })
  if (!res.ok) throw new Error(`Badakan file download failed (${res.status})`)
  const contentType = format ?? res.headers.get('content-type') ?? 'application/octet-stream'
  const ext = contentType.includes('pdf') ? 'pdf' : contentType.includes('png') ? 'png' : 'jpg'
  return {
    body: Buffer.from(await res.arrayBuffer()),
    contentType,
    filename: `${filenameStem}.${ext}`,
  }
}
