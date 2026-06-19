export function candidateCvApiPath(candidateId: string) {
  return `/api/candidates/${candidateId}/cv`
}

export function inferCvMimeType(cvUrl: string) {
  return cvUrl.toLowerCase().includes('.png') ? 'image/png' : 'application/pdf'
}

export function inferCvFilename(cvUrl: string) {
  try {
    const pathname = new URL(cvUrl).pathname
    return decodeURIComponent(pathname.split('/').pop() ?? 'cv.pdf')
  } catch {
    return 'cv.pdf'
  }
}
