'use client'

import { useState } from 'react'
import { FolderOpen } from 'lucide-react'
import { EmptyState } from '@/components/atoms/EmptyState'
import { SectionCard } from '@/components/molecules/SectionCard'
import { SoftDeleteModal } from '@/components/molecules/soft-delete-modal/soft-delete-modal'
import { ReferentialAddForm } from '@/components/molecules/ReferentialAddForm'
import { JobTitleCard } from '@/components/molecules/JobTitleCard'
import { GenericTrameCard } from '@/components/molecules/GenericTrameCard'
import { INTERVIEW_TEMPLATE_METIERS_HINT } from '@/view-models/interview-template-admin-copy'
import type { RefItem, ReferentialActions } from '@/view-models/referential'
import type { InterviewTemplatePairStatus } from '@/view-models/interview-template-pairs'
import type { InterviewTemplateListRow } from '@/server/interview/template-admin-types'

type Props = ReferentialActions & {
  items: RefItem[]
  pairs: InterviewTemplatePairStatus[]
  published: InterviewTemplateListRow[]
}

export function JobTitleAdminList({ items, pairs, published, onAdd, onRename, onDelete }: Props) {
  const [pendingDelete, setPendingDelete] = useState<RefItem | null>(null)

  return (
    <>
      <SectionCard
        variant="glass"
        title="Métiers"
        description={INTERVIEW_TEMPLATE_METIERS_HINT}
        bodyClassName="space-y-4 p-4 sm:p-5"
      >
        <ReferentialAddForm label="métier" onAdd={onAdd} />
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <GenericTrameCard />
          {items.length === 0 ? (
            <li>
              <EmptyState
                icon={FolderOpen}
                title="Aucun élément pour l’instant"
                description="Ajoutez une entrée via le formulaire ci-dessus."
              />
            </li>
          ) : (
            items.map((item) => (
              <JobTitleCard
                key={item.id}
                item={item}
                pairs={pairs}
                published={published}
                onRename={onRename}
                onDelete={(id) => {
                  const row = items.find((entry) => entry.id === id)
                  if (row) setPendingDelete(row)
                }}
              />
            ))
          )}
        </ul>
      </SectionCard>
      <SoftDeleteModal
        entityName={pendingDelete?.name ?? ''}
        open={Boolean(pendingDelete)}
        onOpenChange={(next) => {
          if (!next) setPendingDelete(null)
        }}
        onConfirm={async () => {
          if (pendingDelete) await onDelete(pendingDelete.id)
        }}
      />
    </>
  )
}
