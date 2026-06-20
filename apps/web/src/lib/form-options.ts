type NamedRef = { id: string; name: string }

export function toSelectOptions(items: NamedRef[]) {
  return items.map((item) => ({ value: item.id, label: item.name }))
}
