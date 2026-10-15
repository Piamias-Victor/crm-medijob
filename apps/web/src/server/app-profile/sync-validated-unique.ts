export function isBadakanIdUniqueViolation(error: unknown): boolean {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return false
  }
  return (error as { code: string }).code === 'P2002'
}
