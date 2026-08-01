export const IDLE_ACTIVITY_EVENTS = [
  'mousemove',
  'mousedown',
  'keydown',
  'scroll',
  'touchstart',
  'wheel',
] as const

/** Min gap between session.update() calls while active. */
export const IDLE_TOUCH_THROTTLE_MS = 60_000
