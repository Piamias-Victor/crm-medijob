type Props = { title: string; description: string }

export function AuthFormHeader({ title, description }: Props) {
  return (
    <header className="mb-6 text-center">
      <h1 className="text-lg font-semibold text-fg">{title}</h1>
      <p className="mt-2 text-sm text-fg-muted">{description}</p>
    </header>
  )
}
