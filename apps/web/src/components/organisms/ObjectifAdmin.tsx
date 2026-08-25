'use client'

import { SectionCard } from '@/components/molecules/SectionCard'
import { ObjectifForm } from '@/components/molecules/ObjectifForm'
import { useObjectifSave } from '@/lib/hooks/use-objectif-save'
import type { Objectif } from '@/view-models/objectif'

export function ObjectifAdmin({ objectif }: { objectif: Objectif }) {
  const save = useObjectifSave()
  return (
    <SectionCard
      variant="glass"
      title="Objectifs"
      description="Montants mensuels CA / Marge par pôle et seuil de rentabilité. L’annuel Pilotage = ×12."
      bodyClassName="p-4 sm:p-5"
    >
      <ObjectifForm
        defaultValues={objectif}
        submitting={save.isPending}
        onSubmit={(data) => save.mutate(data)}
      />
    </SectionCard>
  )
}
