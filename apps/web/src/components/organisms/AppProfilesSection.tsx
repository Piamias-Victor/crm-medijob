'use client'

import { useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { SectionCard } from '@/components/molecules/SectionCard'
import { AppProfilesTable } from '@/components/molecules/AppProfilesTable'
import { AppProfileAcceptModal } from '@/components/molecules/AppProfileAcceptModal'
import { CandidateDuplicateAlertModal } from '@/components/molecules/candidate-duplicate-alert/CandidateDuplicateAlertModal'
import { useAppProfileActions } from '@/lib/hooks/use-app-profile-actions'
import { buildAppProfileAcceptDefaults } from '@/view-models/app-profile-accept-defaults'
import type { AppProfileListItem } from '@/view-models/app-profile-list'
import type { RefItem } from '@/view-models/referential'
import { useRouter } from 'next/navigation'

type Props = { initialItems: AppProfileListItem[]; jobTitles: RefItem[] }

export function AppProfilesSection({ initialItems, jobTitles }: Props) {
  const router = useRouter()
  const { data: session } = useSession()
  const actions = useAppProfileActions(initialItems)
  const defaults = useMemo(() => {
    if (!actions.accepting || !session?.user?.id) return null
    return buildAppProfileAcceptDefaults(
      actions.accepting,
      session.user.id,
      jobTitles[0]?.id ?? '',
    )
  }, [actions.accepting, session?.user?.id, jobTitles])

  return (
    <SectionCard
      variant="glass"
      title="Profils app"
      description="Nouveaux inscrits Badakan — créez ou ignorez avant intégration CVthèque."
      bodyClassName="p-4 sm:p-5"
      actions={
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          disabled={actions.sync.isPending}
          onClick={() => actions.sync.mutate()}
        >
          <RefreshCw className={`size-4 ${actions.sync.isPending ? 'animate-spin' : ''}`} />
          Synchroniser
        </Button>
      }
    >
      <AppProfilesTable
        items={actions.items}
        busyId={actions.ignore.isPending ? actions.accepting?.id ?? null : null}
        onAccept={actions.setAccepting}
        onIgnore={(row) => actions.ignore.mutate({ id: row.id })}
      />
      {defaults && actions.accepting ? (
        <AppProfileAcceptModal
          open
          defaultValues={defaults}
          jobTitles={jobTitles}
          submitting={actions.accept.isPending}
          onClose={() => actions.setAccepting(null)}
          onSubmit={actions.submitAccept}
        />
      ) : null}
      <CandidateDuplicateAlertModal
        open={actions.matches.length > 0}
        matches={actions.matches}
        variant="merge"
        onClose={() => actions.setMatches([])}
        onContinue={() => {
          if (actions.accepting && actions.pendingData) {
            actions.accept.mutate({ id: actions.accepting.id, data: actions.pendingData })
          }
          actions.setMatches([])
        }}
        onEdit={(id) => router.push(`/candidats/${id}`)}
        onMerge={(candidateId) => {
          if (!actions.accepting) return
          actions.accept.mutate({ id: actions.accepting.id, mergeCandidateId: candidateId })
        }}
      />
    </SectionCard>
  )
}
