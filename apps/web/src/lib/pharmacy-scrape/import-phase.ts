export type ScrapeImportPhase =
  | 'idle'
  | 'reading'
  | 'analyzing'
  | 'ready'
  | 'importing'
  | 'done'

export type ScrapeUpload = { filename: string; size: number; dataBase64: string }

export function scrapeImportErrorMessage(e: unknown): string {
  return e instanceof Error ? e.message : 'Import impossible'
}
