'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Plus } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { Button } from '@/components/atoms/Button'
import { EntityListPageShell } from '@/components/molecules/EntityListPageShell'
import { PharmacyFormModal } from '@/components/molecules/PharmacyFormModal'
import { PharmacyList } from '@/components/organisms/PharmacyList'
import type { PharmacyListRow } from '@/view-models/pharmacy-list'

type Ref = { id: string; name: string }

type Props = {
  rows: PharmacyListRow[]
  groupements: Ref[]
  softwares: Ref[]
}

export function PharmaciesView({ rows, groupements, softwares }: Props) {
  const router = useRouter()
  const utils = trpc.useUtils()
  const [open, setOpen] = useState(false)
  const description = useMemo(() => `${rows.length} officine(s) au portefeuille`, [rows.length])
  const refresh = () => {
    setOpen(false)
    router.refresh()
  }
  const createMutation = useEntityMutation({ onSuccess: refresh, successMessage: 'Pharmacie créée' })
  const refMutation = useEntityMutation()
  const create = trpc.pharmacy.create.useMutation(createMutation)
  const newGroupement = trpc.pharmacy.createGroupement.useMutation(refMutation)
  const newSoftware = trpc.pharmacy.createSoftware.useMutation(refMutation)

  return (
    <EntityListPageShell
      icon={<Building2 className="size-5" />}
      title="Pharmacies"
      description={description}
      sectionTitle="Portefeuille client"
      sectionDescription="Officines, groupements, contacts et missions en cours."
      action={
        <Button variant="accent" className="shadow-md shadow-accent/20" onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          Nouvelle pharmacie
        </Button>
      }
      modal={
        <PharmacyFormModal
          open={open}
          groupements={groupements}
          softwares={softwares}
          submitting={create.isPending}
          onClose={() => setOpen(false)}
          onSubmit={(data) => create.mutate(data)}
          onSearchSiret={(query) => utils.pharmacy.searchSiret.fetch({ query })}
          onCreateGroupement={(name) => newGroupement.mutateAsync({ name })}
          onCreateSoftware={(name) => newSoftware.mutateAsync({ name })}
        />
      }
    >
      <PharmacyList rows={rows} />
    </EntityListPageShell>
  )
}
