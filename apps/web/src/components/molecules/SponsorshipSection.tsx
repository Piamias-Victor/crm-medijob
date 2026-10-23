'use client'

import type { ReactNode } from 'react'
import { Combobox } from '@/components/molecules/Combobox'
import { SponsorshipPeerRow } from '@/components/molecules/SponsorshipPeerRow'
import { useSponsorship, type SponsorshipKind } from '@/lib/hooks/use-sponsorship'
import { useSponsorshipActions } from '@/lib/hooks/use-sponsorship-actions'

type Props = {
  kind: SponsorshipKind
  entityId: string
  hrefFor: (id: string) => string
  renderBadge: (status: string) => ReactNode
}

export function SponsorshipSection({ kind, entityId, hrefFor, renderBadge }: Props) {
  const api = useSponsorship(kind, entityId)
  const actions = useSponsorshipActions(api, entityId)
  const sponsor = api.view?.sponsor
  const filleules = api.view?.filleules ?? []

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-fg">Marraine</p>
        <p className="text-xs text-fg-muted">Au plus une marraine.</p>
        {sponsor ? (
          <ul className="flex flex-col gap-2">
            <SponsorshipPeerRow
              href={hrefFor(sponsor.id)}
              name={sponsor.name}
              badge={renderBadge(sponsor.status)}
              onRemove={() => void actions.clearMarraine()}
              removing={api.unlink.isPending}
              removeLabel="Retirer la marraine"
            />
          </ul>
        ) : (
          <Combobox
            remoteSearch
            options={api.options}
            onQueryChange={api.setQuery}
            onChange={(id) => void actions.setMarraine(id)}
            placeholder="Rechercher une marraine…"
            aria-label="Choisir une marraine"
          />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-fg">Filleules</p>
        <p className="text-xs text-fg-muted">
          {filleules.length === 0
            ? 'Aucune filleule pour le moment.'
            : `${filleules.length} filleule${filleules.length > 1 ? 's' : ''}.`}
        </p>
        {filleules.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {filleules.map((f) => (
              <SponsorshipPeerRow
                key={f.id}
                href={hrefFor(f.id)}
                name={f.name}
                badge={renderBadge(f.status)}
                onRemove={() => void actions.removeFilleule(f.id)}
                removing={api.unlink.isPending}
                removeLabel="Retirer la filleule"
              />
            ))}
          </ul>
        ) : null}
        <Combobox
          remoteSearch
          options={api.options}
          onQueryChange={api.setQuery}
          onChange={(id) => void actions.addFilleule(id)}
          placeholder="Ajouter une filleule…"
          aria-label="Ajouter une filleule"
        />
      </div>
    </div>
  )
}
