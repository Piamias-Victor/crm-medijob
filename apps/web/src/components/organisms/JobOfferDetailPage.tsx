'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Megaphone } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { DashboardPage } from '@/components/molecules/DashboardPage'
import { SectionCard } from '@/components/molecules/SectionCard'
import { MissionOffreEditor } from '@/components/molecules/MissionOffreEditor'
import { MissionOffreToolbar } from '@/components/molecules/MissionOffreToolbar'
import { JobOfferPublicApplyLink } from '@/components/molecules/JobOfferPublicApplyLink'
import { missionOffreHref } from '@/view-models/mission-offer-picker'
import { refreshJobOfferList } from '@/view-models/job-offer-list-refresh'
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

type Props = { offer: JobOfferDetailProps; publicApplyUrl?: string | null }

export function JobOfferDetailPage({ offer, publicApplyUrl = null }: Props) {
  const router = useRouter()
  const utils = trpc.useUtils()
  const refresh = async () => {
    await utils.jobOffer.getById.invalidate({ id: offer.id })
    await refreshJobOfferList({
      invalidateList: () => utils.jobOffer.list.invalidate(),
      refresh: () => router.refresh(),
    })
  }
  const updateOpts = useEntityMutation({ successMessage: 'Offre enregistrée', onSuccess: refresh })
  const publishOpts = useEntityMutation({ successMessage: 'Offre publiée', onSuccess: refresh })
  const unpublishOpts = useEntityMutation({ successMessage: 'Offre dépubliée', onSuccess: refresh })
  const generateOpts = useEntityMutation({ successMessage: 'Brouillon généré', onSuccess: refresh })
  const update = trpc.jobOffer.update.useMutation(updateOpts)
  const publish = trpc.jobOffer.publish.useMutation(publishOpts)
  const unpublish = trpc.jobOffer.unpublish.useMutation(unpublishOpts)
  const generate = trpc.jobOffer.generate.useMutation(generateOpts)

  const onSave = (values: JobOfferFormValues) => update.mutate({ id: offer.id, ...values })
  const city = offer.city ? ` · ${offer.city}` : ''

  return (
    <DashboardPage
      icon={<Megaphone className="size-5" />}
      title={offer.title}
      description={`Offre${city}`}
      nav={
        <Link href="/offres" className="text-sm text-fg-muted hover:text-fg">
          ← Offres
        </Link>
      }
    >
      <SectionCard variant="glass" title="Annonce" description="Édition, publication site.">
        <div className="flex flex-col gap-5">
          <MissionOffreToolbar
            status={offer.status}
            generating={generate.isPending}
            publishing={publish.isPending || unpublish.isPending}
            onGenerate={
              offer.missionId
                ? () => generate.mutate({ missionId: offer.missionId! })
                : undefined
            }
            onPublish={() => publish.mutate({ id: offer.id })}
            onUnpublish={() => unpublish.mutate({ id: offer.id })}
          />
          {publicApplyUrl ? <JobOfferPublicApplyLink url={publicApplyUrl} /> : null}
          {offer.missionId ? (
            <Link
              href={missionOffreHref(offer.missionId)}
              className="text-sm text-accent hover:underline"
            >
              Voir la mission liée
            </Link>
          ) : null}
          <MissionOffreEditor
            title={offer.title}
            content={offer.content}
            submitting={update.isPending}
            onSubmit={onSave}
          />
        </div>
      </SectionCard>
    </DashboardPage>
  )
}
