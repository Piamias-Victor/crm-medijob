export class AppProfileError extends Error {
  constructor(readonly code: 'NOT_FOUND' | 'NOT_PENDING') {
    super(code)
    this.name = 'AppProfileError'
  }
}

export type IgnoreDeps = {
  findById: (id: string) => Promise<{ id: string; status: string } | null>
  markStatus: (id: string, status: 'IGNORE') => Promise<unknown>
}

export async function ignoreAppProfile(id: string, deps: IgnoreDeps) {
  const row = await deps.findById(id)
  if (!row) throw new AppProfileError('NOT_FOUND')
  if (row.status !== 'EN_ATTENTE') throw new AppProfileError('NOT_PENDING')
  await deps.markStatus(id, 'IGNORE')
  return { id, status: 'IGNORE' as const }
}
