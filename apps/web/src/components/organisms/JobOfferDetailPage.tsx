'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Megaphone } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { DashboardPage } from '@/components/molecules/DashboardPage'
import { JobOfferAnnonceCard, type JobOfferDetailProps } from '@/components/organisms/JobOfferAnnonceCard'
import { JobOfferApplications } from '@/components/organisms/JobOfferApplications'
import { refreshJobOfferList } from '@/view-models/job-offer-list-refresh'
import type { InboxItem } from '@/view-models/application-inbox'

export type { JobOfferDetailProps }

type Props = {
  offer: JobOfferDetailProps
  publicApplyUrl?: string | null
  applications: InboxItem[]
}

export function JobOfferDetailPage({ offer, publicApplyUrl = null, applications }: Props) {
  const router = useRouter()
  const utils = trpc.useUtils()
  const refresh = async () => {
    await utils.jobOffer.getById.invalidate({ id: offer.id })
    await refreshJobOfferList({
      invalidateList: () => utils.jobOffer.list.invalidate(),
      refresh: () => router.refresh(),
    })
  }
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
      <div className="flex flex-col gap-6">
        <JobOfferAnnonceCard offer={offer} publicApplyUrl={publicApplyUrl} onRefresh={refresh} />
        <JobOfferApplications items={applications} />
      </div>
    </DashboardPage>
  )
}
