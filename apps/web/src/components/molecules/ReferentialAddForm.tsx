'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { referentialSchema, type ReferentialInput } from '@/server/admin/schema'
import { Input } from '@/components/atoms/Input'
import { Button } from '@/components/atoms/Button'

type Props = { label: string; onAdd: (name: string) => Promise<void> }

export function ReferentialAddForm({ label, onAdd }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ReferentialInput>({ resolver: zodResolver(referentialSchema) })

  const submit = handleSubmit(async ({ name }) => {
    await onAdd(name)
    reset()
  })

  return (
    <form onSubmit={submit} className="flex gap-2 rounded-lg border border-border/80 bg-surface/50 p-2">
      <Input
        aria-label={`Nouveau ${label}`}
        placeholder={`Nouveau ${label}`}
        {...register('name')}
      />
      <Button type="submit" disabled={isSubmitting}>
        Ajouter
      </Button>
    </form>
  )
}
