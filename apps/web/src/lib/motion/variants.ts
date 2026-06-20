import type { Variants, Transition } from 'framer-motion'

export const MOTION_EASE = [0.25, 0.1, 0.25, 1] as const

export const LOGIN_EASE = MOTION_EASE

const easeOut: Transition = { duration: 0.25, ease: MOTION_EASE }

/** Card shadow tokens — rgba kept for cross-browser shadow compositing */
const CARD_SHADOW_REST = '0 1px 2px rgb(0 0 0 / 0.05)'
const CARD_SHADOW_HOVER = '0 4px 12px rgb(0 0 0 / 0.08)'

export const pageEntrance: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: easeOut },
}

export const tabPanelMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.28, ease: MOTION_EASE },
} as const

export const modalEntrance: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.15 } },
}

export const modalOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

export const listItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, ...easeOut },
  }),
}

export const listContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
}

export const skeletonPulse = {
  animate: { opacity: [0.5, 1, 0.5] },
  transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
}

export const cardHover = {
  initial: { boxShadow: CARD_SHADOW_REST },
  whileHover: {
    y: -3,
    scale: 1.01,
    boxShadow: CARD_SHADOW_HOVER,
  },
  transition: { duration: 0.2, ease: MOTION_EASE },
}
