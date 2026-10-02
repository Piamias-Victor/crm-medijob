import type { ApplicationSource } from '@prisma/client'

export const APPLICATION_SOURCE_LABELS: Record<ApplicationSource, string> = {
  BOARD_INGEST: 'Site (board)',
  PUBLIC_APPLY: 'Page postuler',
}

export function applicationSourceLabel(source: ApplicationSource): string {
  return APPLICATION_SOURCE_LABELS[source]
}
