export function getRgpdRegisterUrl(): string | null {
  const url = process.env.RGPD_REGISTER_URL?.trim()
  return url || null
}
