export type RefItem = { id: string; name: string; profileKey?: string | null }

export type CandidateFormReferentials = {
  jobTitles: RefItem[]
  softwares: RefItem[]
  recruiters: RefItem[]
}

export type ReferentialActions = {
  onAdd: (name: string) => Promise<void>
  onRename: (id: string, name: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}
