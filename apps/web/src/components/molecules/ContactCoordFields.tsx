import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { Input } from '@/components/atoms/Input'
import { FormField } from '@/components/molecules/FormField'
import type { ContactInput } from '@/view-models/contact-form.schema'

const fieldClass = 'h-11 rounded-lg bg-white/80'

type Props = {
  register: UseFormRegister<ContactInput>
  errors: FieldErrors<ContactInput>
}

export function ContactCoordFields({ register, errors }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <FormField label="Téléphone" htmlFor="phone">
        <Input id="phone" type="tel" className={fieldClass} {...register('phone')} />
      </FormField>
      <FormField label="Email" htmlFor="email" error={errors.email?.message}>
        <Input id="email" type="email" className={fieldClass} {...register('email')} />
      </FormField>
    </div>
  )
}
