import { describe, it, expect } from 'vitest'
import {
  cardHover,
  listContainer,
  listItem,
  modalOverlay,
  skeletonPulse,
} from '@/lib/motion/variants'

describe('motion variants catalogue', () => {
  it('exports list stagger variants for nav and inbox', () => {
    expect(listItem.hidden).toBeDefined()
    expect((listContainer.visible as { transition: { staggerChildren: number } }).transition).toMatchObject({
      staggerChildren: 0.04,
    })
  })

  it('exports modal overlay fade variants', () => {
    expect(modalOverlay).toMatchObject({ hidden: { opacity: 0 }, visible: { opacity: 1 } })
  })

  it('exports skeleton pulse animation contract', () => {
    expect(skeletonPulse.animate).toEqual({ opacity: [0.5, 1, 0.5] })
  })

  it('cardHover includes shadow tokens on hover', () => {
    expect(cardHover.whileHover).toMatchObject({
      boxShadow: '0 4px 12px rgb(0 0 0 / 0.08)',
    })
  })
})
