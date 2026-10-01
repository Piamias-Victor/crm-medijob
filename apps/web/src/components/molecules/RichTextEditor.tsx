'use client'

import { useEffect, useRef } from 'react'
import { RichTextToolbar } from '@/components/molecules/RichTextToolbar'
import { cn } from '@/lib/cn'

type Props = {
  value: string
  onChange: (html: string) => void
  className?: string
  'aria-label'?: string
}

function runCommand(command: string) {
  document.execCommand(command)
}

export function RichTextEditor({ value, onChange, className, 'aria-label': ariaLabel }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (document.activeElement === el) return
    if (el.innerHTML !== value) el.innerHTML = value
  }, [value])

  return (
    <div className={cn('overflow-hidden rounded-md border border-border bg-white', className)}>
      <RichTextToolbar
        onBold={() => runCommand('bold')}
        onItalic={() => runCommand('italic')}
        onBulletList={() => runCommand('insertUnorderedList')}
      />
      <div
        ref={ref}
        role="textbox"
        aria-multiline
        aria-label={ariaLabel ?? 'Contenu'}
        contentEditable
        suppressContentEditableWarning
        className="min-h-48 px-3 py-2 text-sm text-fg outline-none prose-offer [&_strong]:font-bold [&_ul]:list-disc [&_ul]:pl-5"
        onInput={() => onChange(ref.current?.innerHTML ?? '')}
      />
    </div>
  )
}
