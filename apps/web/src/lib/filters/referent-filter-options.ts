import { REFERENT_NONE_OPTION } from '@/lib/constants/referent-none'

type Ref = { id: string; name: string }

export function buildReferentFilterOptions(recruiters: readonly Ref[]) {
  return [
    REFERENT_NONE_OPTION,
    ...recruiters.map((item) => ({ value: item.id, label: item.name })),
  ]
}
