const IMAGE_MIME = new Set(['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'])
const IMAGE_EXT = new Set(['png', 'jpg', 'jpeg', 'webp', 'gif'])

function extensionOf(filename: string) {
  const parts = filename.trim().toLowerCase().split('.')
  return parts.length > 1 ? (parts.at(-1) ?? '') : ''
}

function isPdf(mimeType: string | null | undefined, filename: string) {
  const mime = (mimeType ?? '').trim().toLowerCase()
  return mime === 'application/pdf' || extensionOf(filename) === 'pdf'
}

function isImage(mimeType: string | null | undefined, filename: string) {
  const mime = (mimeType ?? '').trim().toLowerCase()
  if (IMAGE_MIME.has(mime)) return true
  return IMAGE_EXT.has(extensionOf(filename))
}

export function isPreviewableDocument(input: {
  mimeType: string | null | undefined
  filename: string
}) {
  return isPdf(input.mimeType, input.filename) || isImage(input.mimeType, input.filename)
}

export function isPdfDocument(input: {
  mimeType: string | null | undefined
  filename: string
}) {
  return isPdf(input.mimeType, input.filename)
}

export function buildDocumentPreviewUrl(id: string) {
  return `/api/documents/${id}/preview`
}

export function buildDocumentDownloadUrl(id: string) {
  return `/api/documents/${id}/download`
}

export function buildDocumentPreviewSrc(
  previewUrl: string,
  mimeType: string | null | undefined,
  filename: string,
) {
  if (!isPdf(mimeType, filename)) return previewUrl
  return `${previewUrl}#navpanes=0&toolbar=0&view=Fit`
}
