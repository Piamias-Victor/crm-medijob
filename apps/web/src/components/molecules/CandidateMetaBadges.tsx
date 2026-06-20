import { Briefcase, Hash, MapPin, UserRound } from 'lucide-react'
import { Badge } from '@/components/atoms/Badge'

type Props = {
  jobTitle: string | null
  city: string | null
  postalCode: string | null
  referentName?: string | null
}

export function CandidateMetaBadges({ jobTitle, city, postalCode, referentName }: Props) {
  const location = [postalCode, city].filter(Boolean).join(' · ')

  return (
    <div className="flex flex-wrap gap-1.5">
      {jobTitle ? (
        <Badge variant="accent" className="gap-1">
          <Briefcase className="size-3" aria-hidden />
          {jobTitle}
        </Badge>
      ) : null}
      {location ? (
        <Badge variant="default" className="gap-1">
          <MapPin className="size-3" aria-hidden />
          {location}
        </Badge>
      ) : null}
      {postalCode && !city ? (
        <Badge variant="default" className="gap-1">
          <Hash className="size-3" aria-hidden />
          {postalCode}
        </Badge>
      ) : null}
      {referentName ? (
        <Badge variant="default" className="gap-1">
          <UserRound className="size-3" aria-hidden />
          {referentName}
        </Badge>
      ) : null}
    </div>
  )
}
