'use client'

import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { MissionOffreEditor } from '@/components/molecules/MissionOffreEditor'
import { MissionOffreToolbar } from '@/components/molecules/MissionOffreToolbar'
import type { JobOfferFormValues } from '@/view-models/job-offer-form.schema'

type Props = { missionId: string }

export function MissionOffreTab({ missionId }: Props) {
  const router = useRouter()
  const utils = trpc.useUtils()
  const { data: offer, isLoading } = trpc.jobOffer.getByMissionId.useQuery({ missionId })

  const refresh = async () => {
    await utils.jobOffer.getByMissionId.invalidate({ missionId })
    router.refresh()
  }

  const generateOpts = useEntityMutation({ successMessage: 'Brouillon généré', onSuccess: refresh })
  const updateOpts = useEntityMutation({ successMessage: 'Offre enregistrée', onSuccess: refresh })
  const publishOpts = useEntityMutation({ successMessage: 'Offre publiée', onSuccess: refresh })
  const unpublishOpts = useEntityMutation({ successMessage: 'Offre dépubliée', onSuccess: refresh })

  const generate = trpc.jobOffer.generate.useMutation(generateOpts)
  const update = trpc.jobOffer.update.useMutation(updateOpts)
  const publish = trpc.jobOffer.publish.useMutation(publishOpts)
  const unpublish = trpc.jobOffer.unpublish.useMutation(unpublishOpts)

  if (isLoading) return <p className="text-sm text-fg-muted">Chargement…</p>

  const onSave = (values: JobOfferFormValues) => {
    if (!offer) return
    update.mutate({ id: offer.id, ...values })
  }

  return (
    <div className="flex flex-col gap-5">
      <MissionOffreToolbar
        status={offer?.status ?? null}
        generating={generate.isPending}
        publishing={publish.isPending || unpublish.isPending}
        onGenerate={() => generate.mutate({ missionId })}
        onPublish={() => offer && publish.mutate({ id: offer.id })}
        onUnpublish={() => offer && unpublish.mutate({ id: offer.id })}
      />
      {offer ? (
        <MissionOffreEditor
          title={offer.title}
          content={offer.content}
          submitting={update.isPending}
          onSubmit={onSave}
        />
      ) : null}
    </div>
  )
}
