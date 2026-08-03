import type { Variants } from 'framer-motion'

export const drawerPanel: Variants = {
  hidden: { x: '100%' },
  visible: { x: 0, transition: { duration: 0.22, ease: 'easeOut' } },
  exit: { x: '100%', transition: { duration: 0.18 } },
}

export const drawerOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}
