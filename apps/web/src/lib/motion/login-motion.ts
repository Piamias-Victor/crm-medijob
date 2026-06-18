import { LOGIN_EASE } from '@/lib/motion/variants'

export const LOGIN_CARD_MOTION = {
  initial: { opacity: 0, y: 24, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.5, ease: LOGIN_EASE },
} as const

export const LOGIN_HEADER_MOTION = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: 0.12, ease: LOGIN_EASE },
} as const

export const LOGIN_FORM_MOTION = {
  initial: { opacity: 0, y: 12, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 0.35, delay: 0.22, ease: LOGIN_EASE },
} as const
