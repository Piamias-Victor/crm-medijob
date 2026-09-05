'use client'

import { DetailPageHeader } from '@/components/molecules/DetailPageHeader'
import { EntityDetailShell } from '@/components/molecules/EntityDetailShell'
import { SectionCard } from '@/components/molecules/SectionCard'
import { DetailFieldList } from '@/components/molecules/DetailFieldList'
import { AppProfileDetailActions } from '@/components/molecules/AppProfileDetailActions'
import { CandidateDuplicateAlertModal } from '@/components/molecules/candidate-duplicate-alert/CandidateDuplicateAlertModal'
import { useAppProfileDetailActions } from '@/lib/hooks/use-app-profile-detail-actions'
import { appProfileDetailFields } from '@/view-models/app-profile-detail-fields'
import { candidatsPageHref } from '@/view-models/candidats-tab'
import type { AppProfileListItem } from '@/view-models/app-profile-list'
import type { CandidateCreateInput } from '@/view-models/candidate-profile.schema'
import {
  BADAKAN_COMMENTS_TITLE,
  type BadakanCommentRow,
} from '@/view-models/badakan-comment'
import { BadakanCommentList } from '@/components/molecules/BadakanCommentList'
import { useRouter } from 'next/navigation'

type Props = {
  profile: AppProfileListItem
  defaults: CandidateCreateInput
  comments: BadakanCommentRow[]
}

export function AppProfileDetailPage({ profile, defaults, comments }: Props) {
  const router = useRouter()
  const actions = useAppProfileDetailActions(profile.id, defaults)
  const pending = profile.status === 'EN_ATTENTE'
  const name = `${profile.firstName} ${profile.lastName}`.trim()

  return (
    <EntityDetailShell
      header={
        <DetailPageHeader
          backHref={candidatsPageHref('app-profiles')}
          backLabel="Profils app"
          name={name || 'Profil app'}
          jobTitle={profile.jobTitleName ?? profile.activityLabel ?? undefined}
          city={profile.city ?? undefined}
        />
      }
      tabKey="infos"
    >
      <div className="flex flex-col gap-6">
        <SectionCard
          variant="glass"
          title="Profil application"
          description="Vérifiez les infos avant conversion ou entretien."
          bodyClassName="space-y-5 p-5 sm:p-6"
        >
          <DetailFieldList fields={appProfileDetailFields(profile)} />
          <AppProfileDetailActions
            profileId={profile.id}
            pending={pending}
            hasResume={profile.hasResume}
            ignoring={actions.ignoring}
            accepting={actions.accepting}
            onIgnore={actions.ignore}
            onInterview={actions.startInterview}
          />
        </SectionCard>
        <SectionCard
          variant="glass"
          title={BADAKAN_COMMENTS_TITLE}
          description="Résumés d’appel lus depuis l’app. Les nouvelles notes vont dans l’historique CRM."
          bodyClassName="p-5 sm:p-6"
        >
          <BadakanCommentList comments={comments} />
        </SectionCard>
      </div>
      <CandidateDuplicateAlertModal
        open={actions.matches.length > 0}
        matches={actions.matches}
        variant="merge"
        onClose={() => actions.setMatches([])}
        onContinue={() => actions.continueCreate()}
        onEdit={(id) => router.push(`/candidats/${id}`)}
        onMerge={actions.merge}
      />
    </EntityDetailShell>
  )
}
