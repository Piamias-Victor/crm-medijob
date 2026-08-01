import {
  GLOBAL_SEARCH_GROUP_LABELS,
  GLOBAL_SEARCH_GROUP_ORDER,
} from '@/lib/constants/global-search-labels'
import { GLOBAL_SEARCH_GROUP_ICONS } from '@/lib/constants/global-search-icons'

export function GlobalSearchIdle() {
  return (
    <div className="flex flex-col gap-4 px-4 py-5">
      <p className="text-sm text-fg-muted">
        Tape au moins 2 caractères pour chercher dans le CRM.
      </p>
      <ul className="grid grid-cols-2 gap-2">
        {GLOBAL_SEARCH_GROUP_ORDER.map((key) => {
          const Icon = GLOBAL_SEARCH_GROUP_ICONS[key]
          return (
            <li
              key={key}
              className="flex items-center gap-2 rounded-md bg-surface px-3 py-2 text-sm text-fg"
            >
              <Icon className="size-4 shrink-0 text-primary" aria-hidden />
              {GLOBAL_SEARCH_GROUP_LABELS[key]}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
