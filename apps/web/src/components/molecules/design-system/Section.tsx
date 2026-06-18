import { type ReactNode } from 'react'

type Props = { id: string; title: string; children: ReactNode }

export function Section({ id, title, children }: Props) {
  const headingId = `${id}-title`

  return (
    <section id={id} aria-labelledby={headingId} className="scroll-mt-8">
      <h2 id={headingId} className="mb-4 text-lg font-semibold text-fg">
        {title}
      </h2>
      <div className="rounded-lg border border-border bg-white p-6">{children}</div>
    </section>
  )
}
