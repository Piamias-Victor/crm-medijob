'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactInputSchema, type ContactInput } from '@/view-models/contact-form.schema'
import { cn } from '@/lib/cn'
import { Button } from '@/components/atoms/Button'
import { ContactFormFields } from '@/components/molecules/ContactFormFields'

type Ref = { id: string; name: string }

type Props = {
  defaultValues?: Partial<ContactInput>
  pharmacies: Ref[]
  submitting: boolean
  onSubmit: (data: ContactInput) => void
  layout?: 'default' | 'detail'
}

export function ContactForm({ defaultValues, pharmacies, submitting, onSubmit, layout = 'default' }: Props) {
  const { register, handleSubmit, control, formState } = useForm<ContactInput>({
    resolver: zodResolver(contactInputSchema),
    defaultValues: { role: 'AUTRE', isPrimary: false, ...defaultValues },
  })
  const pharmacyOptions = pharmacies.map((p) => ({ value: p.id, label: p.name }))
  const detail = layout === 'detail'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn('flex flex-col', detail ? 'gap-5' : 'gap-4')}>
      <ContactFormFields
        register={register}
        control={control}
        errors={formState.errors}
        pharmacyOptions={pharmacyOptions}
      />
      <div className={cn(detail && 'flex justify-end border-t border-border pt-4')}>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  )
}
