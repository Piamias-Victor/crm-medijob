const ALLOWED: Record<string, readonly string[]> = {
  pdf: ['application/pdf'],
  png: ['image/png'],
}

function extensionOf(filename: string) {
  const parts = filename.trim().toLowerCase().split('.')
  return parts.length > 1 ? parts.at(-1) ?? '' : ''
}

export const CV_UPLOAD_ACCEPT = ['application/pdf', 'image/png', '.pdf', '.png'].join(',')

export const CV_UPLOAD_HINT = 'PDF ou PNG · max 10 Mo'

export function isAllowedCvUpload(input: { filename: string; mimeType: string }) {
  const ext = extensionOf(input.filename)
  const allowedMimes = ALLOWED[ext]
  if (!allowedMimes) return false
  const mime = input.mimeType.trim().toLowerCase()
  return allowedMimes.includes(mime)
}

export function cvUploadError(input: { filename: string; mimeType: string }) {
  return isAllowedCvUpload(input)
    ? null
    : 'Format non supporté. Formats acceptés : PDF, PNG.'
}
