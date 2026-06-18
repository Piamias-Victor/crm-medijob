import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { Input } from '@/components/atoms/Input'
import { FormField } from '@/components/molecules/FormField'
import type { ContactInput } from '@/view-models/contact-form.schema'

const fieldClass = 'h-11 rounded-lg bg-white/80'

type Props = {
  register: UseFormRegister<ContactInput>
  errors: FieldErrors<ContactInput>
}

export function ContactIdentityFields({ register, errors }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <FormField label="Prénom" htmlFor="firstName" error={errors.firstName?.message}>
        <Input id="firstName" className={fieldClass} {...register('firstName')} />
      </FormField>
      <FormField label="Nom" htmlFor="lastName" error={errors.lastName?.message}>
        <Input id="lastName" className={fieldClass} {...register('lastName')} />
      </FormField>
    </div>
  )
}
