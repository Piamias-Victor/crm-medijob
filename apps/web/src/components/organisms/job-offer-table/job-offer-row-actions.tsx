'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Pencil, Globe, EyeOff, Trash2 } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { Button } from '@/components/atoms/Button'
import { SoftDeleteModal } from '@/components/molecules/soft-delete-modal/soft-delete-modal'
import type { JobOfferListRow } from '@/view-models/job-offer-list'
import { jobOfferDetailHref } from '@/view-models/job-offer-href'
import { refreshJobOfferList } from '@/view-models/job-offer-list-refresh'

type Props = { row: JobOfferListRow }

export function JobOfferRowActions({ row }: Props) {
  const router = useRouter()
  const utils = trpc.useUtils()
  const [open, setOpen] = useState(false)
  const refresh = () =>
    refreshJobOfferList({
      invalidateList: () => utils.jobOffer.list.invalidate(),
      refresh: () => router.refresh(),
    })
  const publishOpts = useEntityMutation({ successMessage: 'Offre publiée', onSuccess: refresh })
  const unpublishOpts = useEntityMutation({ successMessage: 'Offre dépubliée', onSuccess: refresh })
  const deleteOpts = useEntityMutation({
    successMessage: 'Offre supprimée',
    onSuccess: async () => {
      setOpen(false)
      await refresh()
    },
  })
  const publish = trpc.jobOffer.publish.useMutation(publishOpts)
  const unpublish = trpc.jobOffer.unpublish.useMutation(unpublishOpts)
  const softDelete = trpc.jobOffer.softDelete.useMutation(deleteOpts)
  const busy = publish.isPending || unpublish.isPending || softDelete.isPending

  return (
    <>
      <div className="flex flex-wrap items-center gap-1">
        <Link
          href={jobOfferDetailHref(row.id)}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-fg hover:bg-surface"
        >
          <Pencil className="size-3.5" />
          Modifier
        </Link>
        {row.status !== 'PUBLIEE' ? (
          <Button
            variant="ghost"
            className="h-auto gap-1 px-2 py-1 text-xs"
            disabled={busy}
            onClick={() => publish.mutate({ id: row.id })}
          >
            <Globe className="size-3.5" />
            Publier
          </Button>
        ) : (
          <Button
            variant="ghost"
            className="h-auto gap-1 px-2 py-1 text-xs"
            disabled={busy}
            onClick={() => unpublish.mutate({ id: row.id })}
          >
            <EyeOff className="size-3.5" />
            Dépublier
          </Button>
        )}
        <Button
          variant="ghost"
          className="h-auto gap-1 px-2 py-1 text-xs text-error"
          disabled={busy}
          onClick={() => setOpen(true)}
        >
          <Trash2 className="size-3.5" />
          Supprimer
        </Button>
      </div>
      <SoftDeleteModal
        entityName={row.title}
        open={open}
        onOpenChange={setOpen}
        onConfirm={async () => {
          await softDelete.mutateAsync({ id: row.id })
        }}
      />
    </>
  )
}
