type Props = { message: string }

export function FormErrorBanner({ message }: Props) {
  return (
    <p
      role="alert"
      className="rounded-xl border border-error/25 bg-error/5 px-4 py-3 text-sm text-error"
    >
      {message}
    </p>
  )
}
