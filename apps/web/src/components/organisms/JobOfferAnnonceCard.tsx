'use client'

import Link from 'next/link'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { SectionCard } from '@/components/molecules/SectionCard'
import { MissionOffreEditor } from '@/components/molecules/MissionOffreEditor'
import { MissionOffreToolbar } from '@/components/molecules/MissionOffreToolbar'
import { JobOfferPublicApplyLink } from '@/components/molecules/JobOfferPublicApplyLink'
import { missionOffreHref } from '@/view-models/mission-offer-picker'
import type { JobOfferFormValues } from '@/view-models/job-offer-form.schema'
import type { JobOfferStatus } from '@prisma/client'

export type JobOfferDetailProps = {
  id: string
  title: string
  content: string
  status: JobOfferStatus
  missionId: string | null
  city: string | null
}

type Props = {
  offer: JobOfferDetailProps
  publicApplyUrl: string | null
  onRefresh: () => Promise<void>
}

export function JobOfferAnnonceCard({ offer, publicApplyUrl, onRefresh }: Props) {
  const updateOpts = useEntityMutation({ successMessage: 'Offre enregistrée', onSuccess: onRefresh })
  const publishOpts = useEntityMutation({ successMessage: 'Offre publiée', onSuccess: onRefresh })
  const unpublishOpts = useEntityMutation({
    successMessage: 'Offre dépubliée',
    onSuccess: onRefresh,
  })
  const generateOpts = useEntityMutation({ successMessage: 'Brouillon généré', onSuccess: onRefresh })
  const update = trpc.jobOffer.update.useMutation(updateOpts)
  const publish = trpc.jobOffer.publish.useMutation(publishOpts)
  const unpublish = trpc.jobOffer.unpublish.useMutation(unpublishOpts)
  const generate = trpc.jobOffer.generate.useMutation(generateOpts)

  return (
    <SectionCard variant="glass" title="Annonce" description="Édition, publication site.">
      <div className="flex flex-col gap-5">
        <MissionOffreToolbar
          status={offer.status}
          generating={generate.isPending}
          publishing={publish.isPending || unpublish.isPending}
          onGenerate={
            offer.missionId ? () => generate.mutate({ missionId: offer.missionId! }) : undefined
          }
          onPublish={() => publish.mutate({ id: offer.id })}
          onUnpublish={() => unpublish.mutate({ id: offer.id })}
        />
        {publicApplyUrl ? <JobOfferPublicApplyLink url={publicApplyUrl} /> : null}
        {offer.missionId ? (
          <Link href={missionOffreHref(offer.missionId)} className="text-sm text-accent hover:underline">
            Voir la mission liée
          </Link>
        ) : null}
        <MissionOffreEditor
          title={offer.title}
          content={offer.content}
          submitting={update.isPending}
          onSubmit={(values: JobOfferFormValues) => update.mutate({ id: offer.id, ...values })}
        />
      </div>
    </SectionCard>
  )
}
