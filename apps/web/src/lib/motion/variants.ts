import type { Variants, Transition } from 'framer-motion'

export const MOTION_EASE = [0.25, 0.1, 0.25, 1] as const

export const LOGIN_EASE = MOTION_EASE

const easeOut: Transition = { duration: 0.25, ease: MOTION_EASE }

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

export const cardHover = {
  whileHover: { y: -3, scale: 1.012 },
  transition: { duration: 0.2, ease: MOTION_EASE },
}
