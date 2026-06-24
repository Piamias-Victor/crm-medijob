export type RefItem = { id: string; name: string }

export type ReferentialActions = {
  onAdd: (name: string) => Promise<void>
  onRename: (id: string, name: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}
