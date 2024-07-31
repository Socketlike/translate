import { Engine } from '../types'

export const deepl: Engine = {
  needkey: true,
  fetch: ({ key, from, to, text }) => [
    new URL('v2/translate', `https://api${key?.endsWith?.(':fx') ? '-free' : ''}.deepl.com`),
    {
      method: 'POST',
      headers: {
        Authorization: `DeepL-Auth-Key ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: [text],
        target_lang: to,
        ...(from ? { source_lang: from } : {}),
      }),
    },
  ],
  extraSourceLanguages: [''],
  parse: async (res) => {
    if (res.ok)
      return res
        .json()
        .then((body) => (body as { translations: Array<{ text: string }> }).translations[0].text)

    if (res.status === 403) throw new Error('auth error. check your DeepL API key.')

    throw new Error(`error ${res.status}`)
  },
}
