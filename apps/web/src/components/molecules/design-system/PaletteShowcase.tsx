import { colorTokens } from '@/lib/design-tokens'
import { cn } from '@/lib/cn'

export function PaletteShowcase() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {colorTokens.map((token) => (
        <div key={token.name} className="overflow-hidden rounded-md border border-border">
          <div className={cn('h-16', token.className)} />
          <div className="px-3 py-2">
            <p className="font-mono text-xs text-fg">--color-{token.name}</p>
            <p className="mt-0.5 text-xs text-fg-muted">{token.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
