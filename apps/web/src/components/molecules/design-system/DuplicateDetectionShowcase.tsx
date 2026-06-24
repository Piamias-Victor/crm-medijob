'use client'

import { useState } from 'react'
import { DuplicateDetectionPage } from '@/components/organisms/duplicate-detection-page/duplicate-detection-page'
import { type DuplicateField } from '@/components/organisms/duplicate-detection-page/duplicate-detection-types'
import { useToastStore } from '@/stores/toast-store'

type DemoCandidate = {
  firstName: string
  lastName: string
  email: string
  phone: string
}

const EXISTING: DemoCandidate = {
  firstName: 'Marie',
  lastName: 'Dupont',
  email: 'marie@pharmacie-centre.fr',
  phone: '06 12 34 56 78',
}

const INCOMING: DemoCandidate = {
  firstName: 'Marie',
  lastName: 'Dupont',
  email: 'marie.dupont@gmail.com',
  phone: '06 12 34 56 78',
}

const FIELDS: DuplicateField<DemoCandidate>[] = [
  { key: 'firstName', label: 'Prénom', render: (value) => value },
  { key: 'lastName', label: 'Nom', render: (value) => value },
  { key: 'email', label: 'Email', render: (value) => value },
  { key: 'phone', label: 'Téléphone', render: (value) => value },
]

export function DuplicateDetectionShowcase() {
  const push = useToastStore((s) => s.push)
  const [merging, setMerging] = useState(false)

  return (
    <div className="space-y-4">
      <p className="text-sm text-fg-muted">
        Comparaison côte-à-côte générique — champs différents surlignés, fusion champ par champ.
      </p>
      <DuplicateDetectionPage
        left={EXISTING}
        right={INCOMING}
        fields={FIELDS}
        merging={merging}
        onMerge={async (merged) => {
          setMerging(true)
          await new Promise((resolve) => setTimeout(resolve, 500))
          setMerging(false)
          push({ variant: 'success', message: `Fusion : ${merged.email}` })
        }}
        onIgnore={async () => {
          push({ variant: 'warning', message: 'Ignoré — création sans fusion' })
        }}
        onCancel={() => {
          push({ variant: 'warning', message: 'Annulé — retour sans mutation' })
        }}
      />
    </div>
  )
}
