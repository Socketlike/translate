import { Engine } from '@types'

export const libre: Engine = {
  needkey: false,
  fetch: ({ url, key, from, to, text }) => [
    new URL('translate', url || 'https://libretranslate.com'),
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: from,
        target: to,
        ...(key ? { api_key: key } : {}),
      }),
    },
  ],
  extraSourceLanguages: ['auto'],
  parse: (res) =>
    res.json().then((_) => {
      const body = _ as { error?: string; translatedText?: string } | undefined

      if (!body?.translatedText) throw new Error('no response')
      if (body.error) throw new Error(body.error)

      return body.translatedText
    }),
}
