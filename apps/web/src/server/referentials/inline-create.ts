type Ref = { id: string; name: string }

export type InlineReferentialDeps = {
  createGroupement: (name: string) => Promise<Ref>
  createSoftware: (name: string) => Promise<Ref>
}

export function createInlineReferential(deps: InlineReferentialDeps) {
  return {
    createGroupement: (name: string) => deps.createGroupement(name),
    createSoftware: (name: string) => deps.createSoftware(name),
  }
}
