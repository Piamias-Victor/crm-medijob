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

function clearInheritedBold() {
  if (document.queryCommandState('bold')) document.execCommand('bold')
}

export function RichTextEditor({ value, onChange, className, 'aria-label': ariaLabel }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const lastExternal = useRef(value)

  useEffect(() => {
    document.execCommand('defaultParagraphSeparator', false, 'p')
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (value === lastExternal.current && el.innerHTML) return
    if (document.activeElement === el) return
    el.innerHTML = value
    lastExternal.current = value
  }, [value])

  return (
    <div className={cn('overflow-hidden rounded-md border border-border bg-white', className)}>
      <RichTextToolbar
        onBold={() => {
          ref.current?.focus()
          runCommand('bold')
        }}
        onItalic={() => {
          ref.current?.focus()
          runCommand('italic')
        }}
        onBulletList={() => {
          ref.current?.focus()
          runCommand('insertUnorderedList')
        }}
      />
      <div
        ref={ref}
        role="textbox"
        aria-multiline
        aria-label={ariaLabel ?? 'Contenu'}
        contentEditable
        suppressContentEditableWarning
        className="min-h-48 px-3 py-2 text-sm text-fg outline-none prose-offer [&_strong]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_p[contenteditable=false]]:cursor-default [&_p[contenteditable=false]]:select-none [&_p[contenteditable=false]]:text-fg"
        onFocus={clearInheritedBold}
        onInput={() => {
          const html = ref.current?.innerHTML ?? ''
          lastExternal.current = html
          onChange(html)
        }}
      />
    </div>
  )
}
