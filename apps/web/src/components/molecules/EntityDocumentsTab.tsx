'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import type { DocumentListRow } from '@/view-models/document-list'
import type { DocumentEntityTypeValue } from '@/view-models/activity-log.types'
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog'
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
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const uploadMutation = useEntityMutation({
    onSuccess: () => router.refresh(),
    successMessage: 'Document téléversé',
  })
  const removeMutation = useEntityMutation({
    onSuccess: () => {
      setPendingDeleteId(null)
      router.refresh()
    },
    successMessage: 'Document supprimé',
  })
  const upload = trpc.document.upload.useMutation(uploadMutation)
  const remove = trpc.document.delete.useMutation(removeMutation)

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
        deletingId={remove.isPending ? (remove.variables?.id ?? pendingDeleteId ?? undefined) : undefined}
        onDownload={onDownload}
        onDelete={setPendingDeleteId}
      />
      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Supprimer le document"
        description="Ce document sera retiré définitivement. Cette action est irréversible."
        loading={remove.isPending}
        onClose={() => setPendingDeleteId(null)}
        onConfirm={() => pendingDeleteId && remove.mutate({ id: pendingDeleteId })}
      />
    </div>
  )
}
