'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { intakeStatusAdminSchema } from '@/server/admin/schema'
import { Input } from '@/components/atoms/Input'
import { Button } from '@/components/atoms/Button'

type FormValues = z.infer<typeof intakeStatusAdminSchema>
type Props = { onAdd: (input: FormValues) => Promise<void> }

export function IntakeStatusAddForm({ onAdd }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(intakeStatusAdminSchema),
    defaultValues: { name: '', color: '#FEF3C7' },
  })
  const color = watch('color')

  const submit = handleSubmit(async (values) => {
    await onAdd(values)
    reset({ name: '', color: '#FEF3C7' })
  })

  return (
    <form
      onSubmit={submit}
      className="flex flex-wrap items-center gap-2 rounded-lg border border-border/50 bg-white/60 p-2 backdrop-blur-sm"
    >
      <Input
        aria-label="Nouveau statut"
        placeholder="Nouveau statut"
        className="h-10 min-w-[12rem] flex-1 rounded-lg bg-white/90"
        {...register('name')}
      />
      <input
        type="color"
        aria-label="Couleur"
        value={color}
        onChange={(e) => setValue('color', e.target.value, { shouldValidate: true })}
        className="h-10 w-12 cursor-pointer rounded-md border border-border bg-white"
      />
      <Button type="submit" variant="accent" disabled={isSubmitting} className="shadow-md shadow-accent/20">
        Ajouter
      </Button>
    </form>
  )
}
