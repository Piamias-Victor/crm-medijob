import { ACTIVITY_LOG_PROMPT_DELAY_MS } from '@/lib/mailto/email-compose-timing'

export function scheduleActivityLogPrompt(onPrompt: () => void): () => void {
  let triggered = false

  const trigger = () => {
    if (triggered) return
    triggered = true
    cleanup()
    onPrompt()
  }

  const timeoutId = setTimeout(trigger, ACTIVITY_LOG_PROMPT_DELAY_MS)
  const onFocus = () => trigger()
  window.addEventListener('focus', onFocus)

  function cleanup() {
    clearTimeout(timeoutId)
    window.removeEventListener('focus', onFocus)
  }

  return cleanup
}
