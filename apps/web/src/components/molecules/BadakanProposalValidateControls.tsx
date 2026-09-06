'use client'

import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { parseOptionalProposalAmount } from '@/view-models/parse-optional-proposal-amount'

type Props = {
  pending: boolean
  onValidate: (amountHt: number | null) => void
}

export function BadakanProposalValidateControls({ pending, onValidate }: Props) {
  const [amount, setAmount] = useState('')
  const parsed = parseOptionalProposalAmount(amount)
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <input
        type="text"
        inputMode="decimal"
        placeholder="Montant HT €"
        value={amount}
        disabled={pending}
        onChange={(event) => setAmount(event.target.value)}
        className="w-24 rounded-md border border-border/70 bg-white px-2 py-1 text-xs text-fg"
        aria-label="Montant HT optionnel"
      />
      <Button
        type="button"
        variant="accent"
        disabled={pending || parsed === undefined}
        className="px-2.5 py-1 text-xs"
        onClick={() => {
          if (parsed === undefined) return
          onValidate(parsed)
        }}
      >
        Valider
      </Button>
    </span>
  )
}
