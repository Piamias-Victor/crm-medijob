'use client'

type Props = {
  onBold: () => void
  onItalic: () => void
  onBulletList: () => void
}

export function RichTextToolbar({ onBold, onItalic, onBulletList }: Props) {
  return (
    <div className="flex flex-wrap gap-1 border-b border-border bg-surface px-2 py-1.5" role="toolbar">
      <button
        type="button"
        className="rounded px-2 py-1 text-sm font-bold hover:bg-accent-muted"
        onMouseDown={(e) => {
          e.preventDefault()
          onBold()
        }}
      >
        Gras
      </button>
      <button
        type="button"
        className="rounded px-2 py-1 text-sm italic hover:bg-accent-muted"
        onMouseDown={(e) => {
          e.preventDefault()
          onItalic()
        }}
      >
        Italique
      </button>
      <button
        type="button"
        className="rounded px-2 py-1 text-sm hover:bg-accent-muted"
        onMouseDown={(e) => {
          e.preventDefault()
          onBulletList()
        }}
      >
        Liste
      </button>
    </div>
  )
}
