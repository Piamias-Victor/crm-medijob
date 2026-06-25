'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import type { DocumentListRow } from '@/view-models/document-list'
import type { DocumentEntityTypeValue } from '@/view-models/activity-log.types'
import { SoftDeleteModal } from '@/components/molecules/soft-delete-modal/soft-delete-modal'
import { DocumentUploadForm } from '@/components/molecules/DocumentUploadForm'
import { EntityDocumentsList } from '@/components/molecules/EntityDocumentsList'

type Props = {
  entityType: DocumentEntityTypeValue
  entityId: string
  documents: DocumentListRow[]
  emptyLabel: string
}

export function EntityDocumentsTab({ entityType, entityId, documents, emptyLabel }: Props) {
  const router = useRouter()
  const [pendingDelete, setPendingDelete] = useState<DocumentListRow | null>(null)
  const uploadMutation = useEntityMutation({
    onSuccess: () => router.refresh(),
    successMessage: 'Document téléversé',
  })
  const removeMutation = useEntityMutation({
    onSuccess: () => {
      setPendingDelete(null)
      router.refresh()
    },
    successMessage: 'Document supprimé',
  })
  const upload = trpc.document.upload.useMutation(uploadMutation)
  const remove = trpc.document.delete.useMutation({ onSuccess: removeMutation.onSuccess })

  const onDownload = (id: string) => {
    window.open(`/api/documents/${id}/download`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="flex flex-col gap-5">
      <DocumentUploadForm
        submitting={upload.isPending}
        onUpload={(file) =>
          upload.mutate({
            entityType,
            entityId,
            ...file,
          })
        }
      />
      <EntityDocumentsList
        documents={documents}
        emptyLabel={emptyLabel}
        deletingId={remove.isPending ? (remove.variables?.id ?? pendingDelete?.id ?? undefined) : undefined}
        onDownload={onDownload}
        onDelete={(id) => {
          const doc = documents.find((entry) => entry.id === id)
          if (doc) setPendingDelete(doc)
        }}
      />
      <SoftDeleteModal
        entityName={pendingDelete?.name ?? ''}
        open={pendingDelete !== null}
        onOpenChange={(next) => {
          if (!next) setPendingDelete(null)
        }}
        onConfirm={async () => {
          if (!pendingDelete) return
          await remove.mutateAsync({ id: pendingDelete.id })
        }}
      />
    </div>
  )
}
