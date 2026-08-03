export function GlobalSearchFooter() {
  return (
    <footer className="flex items-center gap-3 border-t border-border/70 bg-surface/80 px-4 py-2 text-[11px] text-fg-muted">
      <span>
        <kbd className="rounded border border-border bg-white px-1 py-0.5 font-sans">↵</kbd>{' '}
        ouvrir
      </span>
      <span>
        <kbd className="rounded border border-border bg-white px-1 py-0.5 font-sans">esc</kbd>{' '}
        fermer
      </span>
      <span className="ml-auto">
        <kbd className="rounded border border-border bg-white px-1 py-0.5 font-sans">⌘K</kbd>
      </span>
    </footer>
  )
}
