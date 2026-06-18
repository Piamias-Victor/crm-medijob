'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Plus } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import type { PharmacyListRow } from '@/view-models/pharmacy-list'
import { Button } from '@/components/atoms/Button'
import { DashboardPage } from '@/components/molecules/DashboardPage'
import { SectionCard } from '@/components/molecules/SectionCard'
import { PharmacyFormModal } from '@/components/molecules/PharmacyFormModal'
import { PharmacyList } from '@/components/organisms/PharmacyList'

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

  const create = trpc.pharmacy.create.useMutation({ onSuccess: refresh })
  const newGroupement = trpc.pharmacy.createGroupement.useMutation()
  const newSoftware = trpc.pharmacy.createSoftware.useMutation()

  return (
    <DashboardPage icon={<Building2 className="size-5" />} title="Pharmacies" description={description}>
      <SectionCard
        variant="glass"
        title="Portefeuille client"
        description="Officines, groupements, contacts et missions en cours."
        bodyClassName="p-4 sm:p-5"
        actions={
          <Button variant="accent" className="shadow-md shadow-accent/20" onClick={() => setOpen(true)}>
            <Plus className="size-4" />
            Nouvelle pharmacie
          </Button>
        }
      >
        <PharmacyList rows={rows} />
      </SectionCard>
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
    </DashboardPage>
  )
}
