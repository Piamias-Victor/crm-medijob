'use client'

import { QuickViewPanel } from '@/components/molecules/quick-view-panel/quick-view-panel'
import { MissionQuickViewContent } from '@/components/molecules/mission-quick-view/mission-quick-view-content'
import { MISSION_QUICK_VIEW_LOADING } from '@/components/molecules/mission-quick-view/mission-quick-view-copy'
import { missionDetailHref } from '@/lib/mission-href'
import { trpc } from '@/lib/trpc/client'

type Props = {
  missionId: string | null
  returnPath: string
  onClose: () => void
}

export function MissionQuickView({ missionId, returnPath, onClose }: Props) {
  const query = trpc.mission.quickView.useQuery(
    { id: missionId ?? '' },
    { enabled: Boolean(missionId) },
  )
  const view = query.data
  const title = view?.title ?? MISSION_QUICK_VIEW_LOADING

  return (
    <QuickViewPanel
      open={Boolean(missionId)}
      onClose={onClose}
      title={title}
      footerHref={missionId ? missionDetailHref(missionId, returnPath) : '#'}
    >
      {view ? (
        <MissionQuickViewContent view={view} />
      ) : (
        <p className="text-sm text-muted">{MISSION_QUICK_VIEW_LOADING}</p>
      )}
    </QuickViewPanel>
  )
}
