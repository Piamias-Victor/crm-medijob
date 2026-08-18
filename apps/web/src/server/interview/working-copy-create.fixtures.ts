export type JobTitleKeyRow = { id: string; name: string; profileKey: string | null }

export function memoryJobTitleKeys(seed: JobTitleKeyRow[] = []) {
  const rows = seed.map((row) => ({ ...row }))
  return {
    rows,
    findById: async (id: string) => rows.find((row) => row.id === id) ?? null,
    findByProfileKey: async (key: string) =>
      rows.find((row) => row.profileKey === key) ?? null,
    setProfileKey: async (id: string, profileKey: string) => {
      const row = rows.find((item) => item.id === id)
      if (row) row.profileKey = profileKey
    },
  }
}
