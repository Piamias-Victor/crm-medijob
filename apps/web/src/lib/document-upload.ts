const EXTENSION_MIME: Record<string, readonly string[]> = {
  pdf: ['application/pdf'],
  png: ['image/png'],
  doc: ['application/msword'],
  docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  csv: ['text/csv', 'application/csv', 'text/plain'],
  xlsx: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
}

export const DOCUMENT_UPLOAD_EXTENSIONS = Object.keys(EXTENSION_MIME)

export const DOCUMENT_UPLOAD_ACCEPT = [
  ...Object.values(EXTENSION_MIME).flat(),
  ...DOCUMENT_UPLOAD_EXTENSIONS.map((ext) => `.${ext}`),
].join(',')

export const DOCUMENT_UPLOAD_HINT = 'PDF, PNG, DOC, DOCX, CSV, XLSX · max 10 Mo'

function extensionOf(filename: string) {
  const parts = filename.trim().toLowerCase().split('.')
  return parts.length > 1 ? parts.at(-1) ?? '' : ''
}

export function isAllowedDocumentUpload(input: { filename: string; mimeType: string }) {
  const ext = extensionOf(input.filename)
  const allowedMimes = EXTENSION_MIME[ext]
  if (!allowedMimes) return false
  const mime = input.mimeType.trim().toLowerCase()
  if (!mime || mime === 'application/octet-stream') return true
  return allowedMimes.includes(mime)
}

export function documentUploadError(input: { filename: string; mimeType: string }) {
  return isAllowedDocumentUpload(input)
    ? null
    : 'Format non supporté. Formats acceptés : PDF, PNG, DOC, DOCX, CSV, XLSX.'
}
