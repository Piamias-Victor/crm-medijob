import { badakanGetRecipient, badakanLogin } from './auth'

export type ResumeFile = {
  body: Buffer
  contentType: string
  filename: string
}

function resumeUrl(detail: unknown): { url: string; format?: string } | null {
  if (!detail || typeof detail !== 'object') return null
  const docs = (detail as { documents?: { RESUME?: { rectoUrl?: string; rectoFormat?: string } } })
    .documents
  const resume = docs?.RESUME
  if (!resume?.rectoUrl) return null
  return { url: resume.rectoUrl, format: resume.rectoFormat }
}

export async function fetchBadakanResume(input: {
  baseUrl: string
  email: string
  password: string
  badakanId: string
  fetchFn?: typeof fetch
}): Promise<ResumeFile | null> {
  const fetchFn = input.fetchFn ?? fetch
  const token = await badakanLogin(input.baseUrl, input.email, input.password, fetchFn)
  const detail = await badakanGetRecipient(input.baseUrl, token, input.badakanId, fetchFn)
  const resume = resumeUrl(detail)
  if (!resume) return null
  const res = await fetchFn(resume.url, { headers: { security_token: token } })
  if (!res.ok) throw new Error(`Badakan CV download failed (${res.status})`)
  const contentType = resume.format ?? res.headers.get('content-type') ?? 'application/octet-stream'
  const ext = contentType.includes('pdf') ? 'pdf' : contentType.includes('png') ? 'png' : 'jpg'
  return {
    body: Buffer.from(await res.arrayBuffer()),
    contentType,
    filename: `badakan-${input.badakanId}.${ext}`,
  }
}
