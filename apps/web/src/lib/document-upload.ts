const EXTENSION_MIME: Record<string, readonly string[]> = {
  pdf: ['application/pdf'],
  png: ['image/png'],
  jpg: ['image/jpeg', 'image/jpg'],
  jpeg: ['image/jpeg', 'image/jpg'],
  webp: ['image/webp'],
  doc: ['application/msword'],
  docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  csv: ['text/csv', 'application/csv', 'text/plain'],
  xlsx: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
}

export const DOCUMENT_UPLOAD_EXTENSIONS = Object.keys(EXTENSION_MIME)
export const DOCUMENT_UPLOAD_STORAGE_ERROR = 'Téléversement impossible pour le moment. Réessaie.'

export const DOCUMENT_UPLOAD_ACCEPT = [
  ...new Set(Object.values(EXTENSION_MIME).flat()),
  ...DOCUMENT_UPLOAD_EXTENSIONS.map((ext) => `.${ext}`),
].join(',')

export const DOCUMENT_UPLOAD_HINT = 'PDF, PNG, JPG, WEBP, DOC, DOCX, CSV, XLSX · max 10 Mo'

function extensionOf(filename: string) {
  const parts = filename.trim().toLowerCase().split('.')
  return parts.length > 1 ? parts.at(-1) ?? '' : ''
}

export function sanitizeDocumentFilename(filename: string) {
  const base = filename.trim().split(/[/\\]/).pop() ?? 'file'
  const safe = base.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
  return (safe || 'file').slice(0, 80)
}

export function resolvedDocumentMime(filename: string, mimeType: string) {
  const mime = mimeType.trim().toLowerCase()
  if (mime && mime !== 'application/octet-stream') return mime
  return EXTENSION_MIME[extensionOf(filename)]?.[0] ?? mime
}

export function isAllowedDocumentUpload(input: { filename: string; mimeType: string }) {
  const ext = extensionOf(input.filename)
  const allowedMimes = EXTENSION_MIME[ext]
  if (!allowedMimes) return false
  const mime = input.mimeType.trim().toLowerCase()
  if (!mime) return Boolean(allowedMimes.length)
  if (mime === 'application/octet-stream') return false
  return allowedMimes.includes(mime)
}

export function documentUploadError(input: { filename: string; mimeType: string }) {
  return isAllowedDocumentUpload(input)
    ? null
    : 'Format non supporté. Formats acceptés : PDF, PNG, JPG, WEBP, DOC, DOCX, CSV, XLSX.'
}
