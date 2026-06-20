export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

const OVERSIZED_MESSAGE = 'Le fichier dépasse la taille déclarée.'

export function maxBase64LengthForSize(size: number): number {
  return Math.ceil(size / 3) * 4
}

export function validateDecodedBase64Size(
  dataBase64: string,
  size: number,
): { ok: true } | { ok: false; message: string } {
  if (dataBase64.length > maxBase64LengthForSize(size)) {
    return { ok: false, message: OVERSIZED_MESSAGE }
  }
  const decodedLength = Buffer.from(dataBase64, 'base64').length
  if (decodedLength > size) {
    return { ok: false, message: OVERSIZED_MESSAGE }
  }
  return { ok: true }
}

export function base64SizeError(dataBase64: string, size: number): string | null {
  const result = validateDecodedBase64Size(dataBase64, size)
  return result.ok ? null : result.message
}
