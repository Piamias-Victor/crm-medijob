export function formatPresentContactLabel(input: {
  firstName?: string | null
  lastName?: string | null
  email: string
}): string {
  const name = `${input.firstName ?? ''} ${input.lastName ?? ''}`.trim()
  if (!name) return input.email
  return `${name} <${input.email}>`
}
