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
    <section className="flex flex-col gap-4 rounded-lg border border-border/80 p-4">
      <h3 className="text-sm font-semibold text-fg">Parrainage</h3>

      <div className="flex flex-col gap-2">
        <p className="text-xs text-fg-muted">Marraine</p>
        {sponsor ? (
          <SponsorshipPeerRow
            href={hrefFor(sponsor.id)}
            name={sponsor.name}
            badge={renderBadge(sponsor.status)}
            onRemove={() => void actions.clearMarraine()}
            removing={api.unlink.isPending}
          />
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
        <p className="text-xs text-fg-muted">Filleules</p>
        <ul className="flex flex-col gap-1">
          {filleules.map((f) => (
            <SponsorshipPeerRow
              key={f.id}
              href={hrefFor(f.id)}
              name={f.name}
              badge={renderBadge(f.status)}
              onRemove={() => void actions.removeFilleule(f.id)}
              removing={api.unlink.isPending}
            />
          ))}
        </ul>
        <Combobox
          remoteSearch
          options={api.options}
          onQueryChange={api.setQuery}
          onChange={(id) => void actions.addFilleule(id)}
          placeholder="Ajouter une filleule…"
          aria-label="Ajouter une filleule"
        />
      </div>
    </section>
  )
}
