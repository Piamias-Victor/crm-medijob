'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Pencil, Globe, EyeOff, Trash2 } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { useCan } from '@/lib/hooks/use-can'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { Button } from '@/components/atoms/Button'
import { SoftDeleteModal } from '@/components/molecules/soft-delete-modal/soft-delete-modal'
import type { JobOfferListRow } from '@/view-models/job-offer-list'
import { missionOffreHref } from '@/view-models/mission-offer-picker'

type Props = { row: JobOfferListRow }

export function JobOfferRowActions({ row }: Props) {
  const router = useRouter()
  const canDelete = useCan('softDelete')
  const [open, setOpen] = useState(false)
  const refresh = () => router.refresh()

  const publishOpts = useEntityMutation({ successMessage: 'Offre publiée', onSuccess: refresh })
  const unpublishOpts = useEntityMutation({ successMessage: 'Offre dépubliée', onSuccess: refresh })
  const deleteOpts = useEntityMutation({
    successMessage: 'Offre supprimée',
    onSuccess: () => {
      setOpen(false)
      refresh()
    },
  })

  const publish = trpc.jobOffer.publish.useMutation(publishOpts)
  const unpublish = trpc.jobOffer.unpublish.useMutation(unpublishOpts)
  const softDelete = trpc.jobOffer.softDelete.useMutation(deleteOpts)
  const busy = publish.isPending || unpublish.isPending || softDelete.isPending

  return (
    <>
      <div className="flex items-center gap-1">
        <Link
          href={missionOffreHref(row.missionId)}
          aria-label="Éditer"
          className="inline-flex size-8 items-center justify-center rounded-md text-fg hover:bg-surface"
        >
          <Pencil className="size-4" />
        </Link>
        {row.status !== 'PUBLIEE' ? (
          <Button
            variant="ghost"
            className="size-8 p-0"
            disabled={busy}
            aria-label="Publier"
            onClick={() => publish.mutate({ id: row.id })}
          >
            <Globe className="size-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            className="size-8 p-0"
            disabled={busy}
            aria-label="Dépublier"
            onClick={() => unpublish.mutate({ id: row.id })}
          >
            <EyeOff className="size-4" />
          </Button>
        )}
        {canDelete ? (
          <Button
            variant="ghost"
            className="size-8 p-0 text-error"
            disabled={busy}
            aria-label="Supprimer"
            onClick={() => setOpen(true)}
          >
            <Trash2 className="size-4" />
          </Button>
        ) : null}
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
