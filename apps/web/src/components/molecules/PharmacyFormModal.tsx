'use client'

import { GlassModal } from '@/components/molecules/GlassModal'
import { PharmacyForm } from '@/components/molecules/PharmacyForm'
import type { PharmacyInput, PharmacySiretLookup } from '@/view-models/pharmacy-form.schema'

type Ref = { id: string; name: string }

type Props = {
  open: boolean
  pharmacyId?: string
  defaultValues?: Partial<PharmacyInput>
  groupements: Ref[]
  softwares: Ref[]
  submitting: boolean
  errorMessage?: string | null
  onClose: () => void
  onSubmit: (data: PharmacyInput) => void
  onSearchSiret: (query: string) => Promise<PharmacySiretLookup[]>
  onCreateGroupement: (name: string) => Promise<Ref>
  onCreateSoftware: (name: string) => Promise<Ref>
}

export function PharmacyFormModal({
  open,
  pharmacyId,
  defaultValues,
  groupements,
  softwares,
  submitting,
  errorMessage,
  onClose,
  onSubmit,
  onSearchSiret,
  onCreateGroupement,
  onCreateSoftware,
}: Props) {
  const isEdit = Boolean(pharmacyId)

  return (
    <GlassModal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Modifier la pharmacie' : 'Nouvelle pharmacie'}
      description={isEdit ? 'Mettez à jour les informations de l’officine.' : 'Ajoutez une officine au portefeuille client.'}
    >
      <PharmacyForm
        key={pharmacyId ?? 'new'}
        defaultValues={defaultValues}
        groupements={groupements}
        softwares={softwares}
        submitting={submitting}
        errorMessage={errorMessage}
        onSubmit={onSubmit}
        onSearchSiret={onSearchSiret}
        onCreateGroupement={onCreateGroupement}
        onCreateSoftware={onCreateSoftware}
      />
    </GlassModal>
  )
}
