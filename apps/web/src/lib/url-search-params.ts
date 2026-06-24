export function toUrlSearchParams(
  params: Record<string, string | string[] | undefined>,
): URLSearchParams {
  const urlParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value == null) continue
    if (Array.isArray(value)) {
      for (const entry of value) urlParams.append(key, entry)
      continue
    }
    urlParams.set(key, value)
  }
  return urlParams
}
