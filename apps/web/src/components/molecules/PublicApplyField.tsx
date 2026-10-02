'use client'

import { Input } from '@/components/atoms/Input'

export function PublicApplyField({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-fg">{label}</span>
      {children}
      {error ? <span className="text-xs text-error">{error}</span> : null}
    </label>
  )
}

export function PublicApplyTextInput(
  props: React.ComponentProps<typeof Input> & { label: string; error?: string },
) {
  const { label, error, className, ...rest } = props
  return (
    <PublicApplyField label={label} error={error}>
      <Input className={`min-h-11 ${className ?? ''}`} {...rest} />
    </PublicApplyField>
  )
}
