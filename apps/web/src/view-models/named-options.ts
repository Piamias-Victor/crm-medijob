export function toNamedOptions(items: { id: string; name: string }[]) {
  return items.map((item) => ({ value: item.id, label: item.name }))
}
