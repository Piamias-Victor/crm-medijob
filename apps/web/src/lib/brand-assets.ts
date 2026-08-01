import logoFull from '@/assets/brand/medijob-logo.png'
import logoMark from '@/assets/brand/medijob-mark.png'

type Asset = string | { src: string }

function assetSrc(asset: Asset): string {
  return typeof asset === 'string' ? asset : asset.src
}

/** Bundled URLs (`_next/static`) — always reachable on login (no middleware). */
export const BRAND_LOGO_SRC = assetSrc(logoFull)
export const BRAND_MARK_SRC = assetSrc(logoMark)
