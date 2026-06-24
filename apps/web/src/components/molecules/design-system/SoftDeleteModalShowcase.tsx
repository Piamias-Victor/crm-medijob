'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { SoftDeleteModal } from '@/components/molecules/soft-delete-modal/soft-delete-modal'

const DEMO_ENTITY = 'Pharmacie du Centre'

export function SoftDeleteModalShowcase() {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-4">
      <p className="text-sm text-fg-muted">
        Modal générique de confirmation avant soft delete — texte SPEC, toast si échec réseau.
      </p>
      <Button type="button" variant="danger" onClick={() => setOpen(true)}>
        <Trash2 className="size-4" />
        Ouvrir la modal
      </Button>
      <SoftDeleteModal
        entityName={DEMO_ENTITY}
        open={open}
        onOpenChange={setOpen}
        onConfirm={async () => {
          await new Promise((resolve) => setTimeout(resolve, 600))
        }}
      />
    </div>
  )
}
