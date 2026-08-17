import { INTERVIEW_CHECKLIST_TITLE } from '@/view-models/interview-copy'

type Section = { id: string; title: string }

type Props = { sections: Section[] }

export function InterviewSectionNav({ sections }: Props) {
  const links = [...sections.map((section) => ({ href: `#${section.id}`, label: section.title })), {
    href: '#dossier',
    label: INTERVIEW_CHECKLIST_TITLE,
  }]

  return (
    <nav className="sticky top-0 z-10 flex flex-wrap gap-2 rounded-xl border border-border bg-white p-2 shadow-sm">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium text-fg hover:border-accent hover:bg-accent-muted"
        >
          {link.label}
        </a>
      ))}
    </nav>
  )
}
