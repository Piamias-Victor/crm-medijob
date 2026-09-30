'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'

type Props = { fromYmd: string; toYmd: string }

export function ActivitePeriodForm({ fromYmd, toYmd }: Props) {
  const router = useRouter()
  return (
    <form
      className="flex flex-wrap items-end gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        const from = String(data.get('from') ?? '')
        const to = String(data.get('to') ?? '')
        const params = new URLSearchParams()
        if (from) params.set('from', from)
        if (to) params.set('to', to)
        router.push(`/activite?${params.toString()}`)
      }}
    >
      <label className="grid gap-1 text-sm text-fg-muted">
        Du
        <Input name="from" type="date" defaultValue={fromYmd} />
      </label>
      <label className="grid gap-1 text-sm text-fg-muted">
        Au
        <Input name="to" type="date" defaultValue={toYmd} />
      </label>
      <Button type="submit">Appliquer</Button>
    </form>
  )
}
