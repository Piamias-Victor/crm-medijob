type Ref = { id: string; name: string }

export const NONE_REFERENT_OPTION = { value: '', label: 'Aucun référent' } as const

/** Combobox options: clearable empty + recruiters. */
export function buildReferentSelectOptions(recruiters: readonly Ref[]) {
  return [
    NONE_REFERENT_OPTION,
    ...recruiters.map((r) => ({ value: r.id, label: r.name })),
  ]
}
