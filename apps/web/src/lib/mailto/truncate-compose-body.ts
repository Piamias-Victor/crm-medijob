export function truncateComposeBody(body: string, maxChars: number): string {
  if (body.length <= maxChars) return body
  if (maxChars <= 1) return '…'
  return `${body.slice(0, maxChars - 1)}…`
}
