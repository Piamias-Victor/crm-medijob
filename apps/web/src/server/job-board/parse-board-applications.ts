import { z } from 'zod'
import type { BoardApplication } from '@/server/job-board/applications-port'

const optionalText = z.string().nullable().optional()

export const boardApplicationSchema = z.object({
  id: z.string().min(1),
  offre_id: z.string().nullish(),
  prenom: z.string().min(1),
  nom: z.string().min(1),
  email: z.string().min(1),
  telephone: optionalText,
  ville: optionalText,
  cv_url: optionalText,
  message: optionalText,
  created_at: optionalText,
})

function toBoardApplication(
  row: z.infer<typeof boardApplicationSchema>,
): BoardApplication {
  return {
    id: row.id,
    offre_id: row.offre_id ?? null,
    prenom: row.prenom,
    nom: row.nom,
    email: row.email,
    telephone: row.telephone ?? null,
    ville: row.ville ?? null,
    cv_url: row.cv_url ?? null,
    message: row.message ?? null,
    created_at: row.created_at ?? undefined,
  }
}

export function parseBoardApplications(payload: unknown): BoardApplication[] {
  if (!Array.isArray(payload)) return []
  const rows: BoardApplication[] = []
  for (const raw of payload) {
    const parsed = boardApplicationSchema.safeParse(raw)
    if (!parsed.success) {
      console.warn('board candidature skipped', parsed.error.issues[0]?.path)
      continue
    }
    rows.push(toBoardApplication(parsed.data))
  }
  return rows
}
