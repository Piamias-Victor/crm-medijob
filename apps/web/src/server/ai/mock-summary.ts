function extractLine(prompt: string, label: string): string | null {
  const match = prompt.match(new RegExp(`${label} : (.+)`))
  return match?.[1]?.trim() ?? null
}

function extractBlock(prompt: string, label: string): string | null {
  const match = prompt.match(new RegExp(`${label} :\\n([\\s\\S]*?)(?:\\n\\n|$)`))
  return match?.[1]?.trim() ?? null
}

export function buildMockSummary(prompt: string): string {
  const jobTitle = extractLine(prompt, 'Métier') ?? 'Professionnel de santé'
  const softwares = extractLine(prompt, 'Logiciels')
  const notes = extractBlock(prompt, 'Notes et expérience') ?? 'Profil à compléter.'
  const skills = softwares ? `\n\n**Logiciels :** ${softwares}` : ''
  return [
    `## ${jobTitle}`,
    '',
    notes,
    skills,
  ].join('\n')
}
