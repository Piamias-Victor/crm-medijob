import { CandidateProfileForm } from '@/components/molecules/CandidateProfileForm'
import { CandidateCvStoredPreview } from '@/components/molecules/CandidateCvStoredPreview'
import { CandidateCvPanel } from '@/components/organisms/CandidateCvPanel'
import { CandidateCvSummaryPanel } from '@/components/organisms/CandidateCvSummaryPanel'
import { CandidateProfileDocsShortcuts } from '@/components/molecules/CandidateProfileDocsShortcuts'
import type { CandidateProfilePayload } from '@/view-models/candidate-profile-payload'
import type { CandidateDetailReferentials } from '@/view-models/candidate-detail-referentials'

type Props = {
  profile: CandidateProfilePayload
  referentials: CandidateDetailReferentials
  onPresentPharmacy?: () => void
  onPresentRadius?: () => void
}

export function CandidateProfilTab({
  profile,
  referentials,
  onPresentPharmacy,
  onPresentRadius,
}: Props) {
  return (
    <div className="flex flex-col gap-8">
      <CandidateCvPanel
        profile={profile}
        referentials={referentials}
        onPresentPharmacy={onPresentPharmacy}
        onPresentRadius={onPresentRadius}
      />
      <CandidateProfileForm candidateId={profile.id} profile={profile} referentials={referentials} />
      <CandidateCvSummaryPanel profile={profile} />
      <CandidateProfileDocsShortcuts />
      {profile.cvUrl ? (
        <CandidateCvStoredPreview candidateId={profile.id} cvUrl={profile.cvUrl} />
      ) : null}
    </div>
  )
}
