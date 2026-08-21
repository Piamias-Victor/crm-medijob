'use client'

import { Button } from '@/components/atoms/Button'
import { applicationConvertPath } from '@/view-models/inbox-detail-href'
import { candidatsPageHref } from '@/view-models/candidats-tab'
import { useRouter } from 'next/navigation'

type Props = {
  applicationId: string
  pending: boolean
  cvUrl: string | null
  refusing: boolean
  accepting: boolean
  onRefuse: () => void
  onInterview: () => void
}

export function ApplicationDetailActions({
  applicationId,
  pending,
  cvUrl,
  refusing,
  accepting,
  onRefuse,
  onInterview,
}: Props) {
  const router = useRouter()
  const busy = refusing || accepting
  return (
    <div className="flex flex-wrap gap-2">
      {cvUrl ? (
        <Button type="button" variant="outline" onClick={() => window.open(cvUrl, '_blank')}>
          Voir le CV
        </Button>
      ) : null}
      {pending ? (
        <>
          <Button
            type="button"
            variant="accent"
            disabled={busy}
            onClick={() => router.push(applicationConvertPath(applicationId))}
          >
            Convertir en profil
          </Button>
          <Button type="button" variant="outline" disabled={busy} onClick={onInterview}>
            Commencer un entretien
          </Button>
          <Button type="button" variant="outline" disabled={busy} onClick={onRefuse}>
            {refusing ? 'Refus…' : 'Refuser'}
          </Button>
        </>
      ) : (
        <Button type="button" variant="outline" onClick={() => router.push(candidatsPageHref('inbox'))}>
          Retour à l’inbox
        </Button>
      )}
    </div>
  )
}
