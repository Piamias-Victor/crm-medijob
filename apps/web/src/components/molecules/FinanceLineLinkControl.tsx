'use client'

import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { Combobox } from '@/components/molecules/Combobox'
import { FormField } from '@/components/molecules/FormField'
import { GlassModal } from '@/components/molecules/GlassModal'
import { trpc } from '@/lib/trpc/client'
import { invalidateFacturationQueries } from '@/lib/hooks/invalidate-facturation-queries'
import { FINANCE_LINE_LINK } from '@/view-models/finance-line-copy'
import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'

type Ref = { id: string; name: string }

type Props = {
  row: FacturationSuiviRow
  pharmacies: Ref[]
  candidates: Ref[]
}

export function FinanceLineLinkControl({ row, pharmacies, candidates }: Props) {
  const [open, setOpen] = useState(false)
  const [pharmacyId, setPharmacyId] = useState(row.pharmacyId ?? '')
  const [candidateId, setCandidateId] = useState(row.candidateId ?? '')
  const utils = trpc.useUtils()
  const mutation = trpc.facturation.linkLine.useMutation({
    onSuccess: () => {
      invalidateFacturationQueries(utils)
      setOpen(false)
    },
  })
  if (!row.financeLineId || (row.pharmacyId && row.candidateId)) return null
  const pharmacyOpts = pharmacies.map((p) => ({ value: p.id, label: p.name }))
  const candidateOpts = candidates.map((c) => ({ value: c.id, label: c.name }))
  return (
    <>
      <Button type="button" variant="outline" className="h-7 px-2 text-xs" onClick={() => setOpen(true)}>
        {FINANCE_LINE_LINK}
      </Button>
      <GlassModal open={open} onClose={() => setOpen(false)} title={FINANCE_LINE_LINK} className="max-w-sm">
        <div className="grid gap-3">
          <FormField label="Pharmacie">
            <Combobox
              value={pharmacyId}
              onChange={setPharmacyId}
              options={pharmacyOpts}
              placeholder="Choisir une pharmacie"
            />
          </FormField>
          <FormField label="Candidat">
            <Combobox
              value={candidateId}
              onChange={setCandidateId}
              options={candidateOpts}
              placeholder="Choisir un candidat"
            />
          </FormField>
          <Button
            type="button"
            disabled={mutation.isPending || !pharmacyId || !candidateId}
            onClick={() =>
              mutation.mutate({ id: row.financeLineId!, pharmacyId, candidateId })
            }
          >
            {FINANCE_LINE_LINK}
          </Button>
        </div>
      </GlassModal>
    </>
  )
}
