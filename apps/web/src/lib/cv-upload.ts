const ALLOWED: Record<string, readonly string[]> = {
  pdf: ['application/pdf'],
  png: ['image/png'],
  jpg: ['image/jpeg'],
  jpeg: ['image/jpeg'],
  webp: ['image/webp'],
}

function extensionOf(filename: string) {
  const parts = filename.trim().toLowerCase().split('.')
  return parts.length > 1 ? parts.at(-1) ?? '' : ''
}

export const CV_UPLOAD_ACCEPT = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
  '.pdf',
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
].join(',')

export const CV_UPLOAD_HINT = 'PDF, PNG, JPG ou WEBP · max 10 Mo'

export function isAllowedCvUpload(input: { filename: string; mimeType: string }) {
  const ext = extensionOf(input.filename)
  const allowedMimes = ALLOWED[ext]
  if (!allowedMimes) return false
  const mime = input.mimeType.trim().toLowerCase()
  // Some browsers send empty mime for images — accept by extension.
  if (!mime) return Boolean(allowedMimes.length)
  return allowedMimes.includes(mime)
}

export function cvUploadError(input: { filename: string; mimeType: string }) {
  return isAllowedCvUpload(input)
    ? null
    : 'Format non supporté. Formats acceptés : PDF, PNG, JPG, WEBP.'
}

export function sanitizeCvFilename(filename: string) {
  const base = filename.trim().split(/[/\\]/).pop() ?? filename.trim()
  const safe = base.replace(/[^\w.\- ()[\]àâäéèêëïîôùûüç]/gi, '_')
  return safe.length > 0 ? safe.slice(0, 200) : 'cv.pdf'
}
