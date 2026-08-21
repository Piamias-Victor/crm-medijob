import type { BoardApplication } from '@/server/job-board/applications-port'

export type IngestApplication = {
  boardSubmissionId: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  city: string | null
  cvUrl: string | null
  message: string | null
  boardListingId: string
  submittedAt: Date | null
}

export function toIngestApplication(row: BoardApplication): IngestApplication {
  return {
    boardSubmissionId: row.id,
    firstName: row.prenom,
    lastName: row.nom,
    email: row.email,
    phone: row.telephone ?? null,
    city: row.ville ?? null,
    cvUrl: row.cv_url ?? null,
    message: row.message ?? null,
    boardListingId: row.offre_id ?? '',
    submittedAt: row.created_at ? new Date(row.created_at) : null,
  }
}
