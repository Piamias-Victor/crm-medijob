import { candidateRepository } from '@/server/db/repositories/candidate.repository'

export async function listCandidatePickerOptions() {
  const rows = await candidateRepository.list()
  return rows.map((row) => ({
    id: row.id,
    name: `${row.firstName} ${row.lastName}`.trim(),
  }))
}
