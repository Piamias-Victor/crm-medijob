'use client'

import { Button } from '@/components/atoms/Button'
import { AppProfileTestProcessButton } from '@/components/molecules/AppProfileTestProcessButton'
import { appProfileConvertPath } from '@/view-models/inbox-detail-href'
import { candidatsPageHref } from '@/view-models/candidats-tab'
import { useRouter } from 'next/navigation'

type Props = {
  profileId: string
  pending: boolean
  hasResume: boolean
  ignoring: boolean
  accepting: boolean
  onIgnore: () => void
  onInterview: () => void
}

export function AppProfileDetailActions({
  profileId,
  pending,
  hasResume,
  ignoring,
  accepting,
  onIgnore,
  onInterview,
}: Props) {
  const router = useRouter()
  const busy = ignoring || accepting
  return (
    <div className="flex flex-wrap gap-2">
      {hasResume ? (
        <p className="w-full text-xs text-fg-muted">CV Badakan importé à la conversion.</p>
      ) : null}
      {pending ? (
        <>
          <Button
            type="button"
            variant="accent"
            disabled={busy}
            onClick={() => router.push(appProfileConvertPath(profileId))}
          >
            Convertir en profil
          </Button>
          <Button type="button" variant="outline" disabled={busy} onClick={onInterview}>
            Commencer un entretien
          </Button>
          <Button type="button" variant="outline" disabled={busy} onClick={onIgnore}>
            {ignoring ? 'Ignore…' : 'Ignorer'}
          </Button>
        </>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(candidatsPageHref('app-profiles'))}
        >
          Retour aux profils app
        </Button>
      )}
      <AppProfileTestProcessButton profileId={profileId} />
    </div>
  )
}
