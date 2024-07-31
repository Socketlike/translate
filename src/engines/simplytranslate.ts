import { Engine } from '../types'

/** override engine by passing `{ engine: <engine> }` to `overrideParams` */
export const simplytranslate: Engine = {
  needkey: false,
  fetch: ({ from, to, text, url, overrideParams }) => [
    new URL(
      `api/translate?${new URLSearchParams({
        engine: 'google',
        ...overrideParams,
        from,
        to,
        text,
      })}`,
      url || 'https://simplytranslate.org',
    ),
  ],
  extraSourceLanguages: ['auto'],
  parse: async (res) => {
    if (!res.ok) throw new Error(`http ${res.status}`)

    return await res.json().then((_) => {
      const body = _ as { translated_text: string }

      if (!body?.translated_text) throw new Error('no response')

      return body.translated_text
    })
  },
}
