const MAX_BYTES = 5 * 1024 * 1024

const MAGIC: Record<string, number[][]> = {
  pdf: [[0x25, 0x50, 0x44, 0x46]], // %PDF
  doc: [[0xd0, 0xcf, 0x11, 0xe0]], // OLE
  docx: [[0x50, 0x4b, 0x03, 0x04]], // ZIP/OOXML
}

const EXT_MIME: Record<string, string> = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

export const PUBLIC_APPLY_CV_MAX_BYTES = MAX_BYTES
export const PUBLIC_APPLY_CV_HINT = 'PDF, DOC ou DOCX · max 5 Mo'
export const PUBLIC_APPLY_CV_ACCEPT = '.pdf,.doc,.docx,application/pdf,application/msword'

function extensionOf(filename: string) {
  const parts = filename.trim().toLowerCase().split('.')
  return parts.length > 1 ? parts.at(-1) ?? '' : ''
}

function matchesMagic(bytes: Uint8Array, patterns: number[][]) {
  return patterns.some((pattern) =>
    pattern.every((byte, index) => bytes[index] === byte),
  )
}

export function sanitizePublicApplyFilename(filename: string) {
  const base = filename.trim().split(/[/\\]/).pop() ?? 'cv'
  const safe = base.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
  return (safe || 'cv').slice(0, 80)
}

export function publicApplyCvError(input: {
  filename: string
  size: number
  bytes: Uint8Array
}): string | null {
  if (input.size > MAX_BYTES) return 'Le CV ne doit pas dépasser 5 Mo'
  const ext = extensionOf(input.filename)
  const patterns = MAGIC[ext]
  if (!patterns) return 'CV accepté : PDF, DOC ou DOCX'
  if (!matchesMagic(input.bytes, patterns)) return 'Le fichier CV ne correspond pas à son type'
  return null
}

export function publicApplyCvMime(filename: string) {
  return EXT_MIME[extensionOf(filename)] ?? 'application/octet-stream'
}
