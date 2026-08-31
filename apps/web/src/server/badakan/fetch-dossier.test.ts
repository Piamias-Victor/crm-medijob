import { describe, expect, it, vi } from 'vitest'
import { fetchBadakanDossier } from './fetch-dossier'

const cfg = {
  baseUrl: 'https://api.example/brother-web',
  email: 'u@x.com',
  password: 'secret',
  badakanId: 'bk-1',
}

function loginThenRecipient(detail: unknown, files: Map<string, { body: string; type: string }>) {
  return vi.fn(async (url: string) => {
    if (String(url).includes('/accounts/login')) {
      return { ok: true, json: async () => ({ securityToken: 'tok' }) }
    }
    if (String(url).includes('/recipients/bk-1')) {
      return { ok: true, json: async () => detail }
    }
    const file = files.get(String(url))
    if (!file) return { ok: false, status: 404 }
    return {
      ok: true,
      arrayBuffer: async () => Buffer.from(file.body),
      headers: { get: (name: string) => (name === 'content-type' ? file.type : null) },
    }
  })
}

describe('fetchBadakanDossier', () => {
  it('downloads CV CNI RIB diploma via injected fetch', async () => {
    const detail = {
      id: 'bk-1',
      firstName: 'Pierre',
      lastName: 'Cylla',
      healthCareNumber: '1850178123456',
      bankAccount: { iban: 'FR76IBAN' },
      documents: {
        RESUME: { rectoUrl: 'https://cdn.example/cv.jpg', rectoFormat: 'image/jpeg' },
        NATIONAL_ID_CARD: {
          rectoUrl: 'https://cdn.example/cni.pdf',
          rectoFormat: 'application/pdf',
        },
        RIB: { rectoUrl: 'https://cdn.example/rib.pdf', rectoFormat: 'application/pdf' },
        DIPLOMA: { rectoUrl: 'https://cdn.example/dip.pdf', rectoFormat: 'application/pdf' },
      },
    }
    const files = new Map([
      ['https://cdn.example/cv.jpg', { body: 'cv', type: 'image/jpeg' }],
      ['https://cdn.example/cni.pdf', { body: 'cni', type: 'application/pdf' }],
      ['https://cdn.example/rib.pdf', { body: 'rib', type: 'application/pdf' }],
      ['https://cdn.example/dip.pdf', { body: 'dip', type: 'application/pdf' }],
    ])
    const dossier = await fetchBadakanDossier({
      ...cfg,
      fetchFn: loginThenRecipient(detail, files) as unknown as typeof fetch,
    })
    expect(dossier?.nir).toBe('1850178123456')
    expect(dossier?.iban).toBe('FR76IBAN')
    expect(dossier?.resume?.filename).toContain('cv')
    expect(dossier?.files.map((f) => f.category).sort()).toEqual(['CNI', 'DIPLOME', 'RIB'])
  })
})
