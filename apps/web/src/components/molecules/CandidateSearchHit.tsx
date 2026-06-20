import { Avatar } from '@/components/atoms/Avatar'
import { CandidateMetaBadges } from '@/components/molecules/CandidateMetaBadges'

type Props = {
  label: string
  jobTitle: string | null
  city: string | null
  postalCode: string | null
}

export function CandidateSearchHit({ label, jobTitle, city, postalCode }: Props) {
  return (
    <div className="flex items-start gap-3">
      <Avatar name={label} className="size-9 shrink-0 text-xs" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-fg">{label}</p>
        <div className="mt-1.5">
          <CandidateMetaBadges jobTitle={jobTitle} city={city} postalCode={postalCode} />
        </div>
      </div>
    </div>
  )
}
