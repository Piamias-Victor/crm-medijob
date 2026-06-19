/** Glass surfaces — inline oklch/rgb shadows intentional (no CSS token for layered glass). */
export const SURFACE_GLASS =
  'relative overflow-hidden rounded-2xl border border-border/60 bg-white/88 shadow-[0_1px_0_rgb(255_255_255/0.9)_inset,0_12px_48px_oklch(0.64_0.10_185/0.14),0_2px_8px_rgb(0_0_0/0.04)] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-accent/35 before:to-transparent'

export const SURFACE_GLASS_PANEL =
  'overflow-hidden rounded-xl border border-border/60 bg-white/88 shadow-[0_1px_0_rgb(255_255_255/0.9)_inset,0_8px_32px_oklch(0.64_0.10_185/0.08),0_1px_3px_rgb(0_0_0/0.04)] backdrop-blur-md'
