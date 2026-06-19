function isPdfPreview(mimeType: string, filename: string) {
  return mimeType === 'application/pdf' || filename.toLowerCase().endsWith('.pdf')
}

export type CvPreviewSize = 'stored' | 'review'

export const CV_PREVIEW_FRAME_CLASS: Record<CvPreviewSize, string> = {
  stored: 'h-[32rem]',
  review: 'h-[70vh] min-h-[32rem]',
}

export function buildCvPreviewSrc(
  previewUrl: string,
  mimeType: string,
  filename: string,
  _size: CvPreviewSize = 'stored',
) {
  if (!isPdfPreview(mimeType, filename)) return previewUrl
  return `${previewUrl}#navpanes=0&toolbar=0&view=Fit`
}

export { isPdfPreview }
