'use client'

import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { SectionCard } from '@/components/molecules/SectionCard'
import { ReferentialManager } from '@/components/organisms/ReferentialManager'
import { CompatibilityMatrix } from '@/components/organisms/CompatibilityMatrix'
import {
  buildCompatibilityScores,
  type CompatibilityPair,
} from '@/view-models/compatibility-matrix'
import type { RefItem } from '@/view-models/referential'

type Props = { titles: RefItem[]; compatibilities: CompatibilityPair[] }

export function JobTitleAdmin({ titles, compatibilities }: Props) {
  const router = useRouter()
  const onSuccess = () => router.refresh()
  const onError = (e: { message: string }) => window.alert(e.message)
  const create = trpc.admin.jobTitle.create.useMutation({ onSuccess })
  const update = trpc.admin.jobTitle.update.useMutation({ onSuccess })
  const remove = trpc.admin.jobTitle.remove.useMutation({ onSuccess, onError })
  const setScore = trpc.admin.jobTitle.setCompatibilityScore.useMutation({ onSuccess, onError })

  return (
    <div className="flex flex-col gap-6">
      <ReferentialManager
        title="Métiers"
        description="Référentiel des métiers candidats et missions."
        itemLabel="métier"
        items={titles}
        onAdd={(name) => create.mutateAsync({ name }).then(() => undefined)}
        onRename={(id, name) => update.mutateAsync({ id, name }).then(() => undefined)}
        onDelete={(id) => remove.mutate({ id })}
      />
      <SectionCard
        variant="glass"
        title="Matrice de compatibilité"
        description="Affinez le pré-filtrage matching entre métiers mission et candidats."
        bodyClassName="p-4 sm:p-5"
      >
        <CompatibilityMatrix
          titles={titles}
          scores={buildCompatibilityScores(compatibilities)}
          onChange={(missionJobTitleId, candidateJobTitleId, score) =>
            setScore.mutate({ missionJobTitleId, candidateJobTitleId, score })
          }
        />
      </SectionCard>
    </div>
  )
}
