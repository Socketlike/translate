import { Engine } from '../types'

export const lingva: Engine = {
  needkey: false,
  fetch: ({ url, from, to, text }) => [
    new URL(
      `api/v1/${encodeURIComponent(from)}/${encodeURIComponent(to)}/${encodeURIComponent(text)}`,
      url || 'https://lingva.ml',
    ),
  ],
  extraSourceLanguages: ['auto'],
  parse: (res) =>
    res.json().then((_) => {
      const body = _ as { translation?: string; error?: string } | undefined

      if (!body?.translation) throw new Error('no response')
      if (body.error) throw new Error(body.error)

      return body.translation
    }),
}
