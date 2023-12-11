import { Engine } from '@types'

export const google: Engine = {
  needkey: false,
  fetch: ({ from: sl, to: tl, text: q }) => [
    new URL(
      `translate_a/single?${new URLSearchParams({ client: 'at', sl, tl, dt: 't', q })}`,
      'https://translate.google.com',
    ),
  ],
  extraSourceLanguages: ['auto'],
  parse: async (res) => {
    if (!res.ok) throw new Error(`http ${res.status}`)

    return await res.json().then((_) => {
      const body = _ as Array<[string]>
      const translation = body?.[0]?.[0] && body[0].map((t) => t[0]).join('')

      if (!translation) throw new Error('no response')

      return translation
    })
  },
}

/** doesn't work in browsers if `referer` or `origin` is set to a site that isn't `https://translate.google.com` */
export const google_batchexecute: Engine = {
  needkey: false,
  fetch: ({ from, to, text }) => [
    new URL('_/TranslateWebserverUi/data/batchexecute', 'https://translate.google.com'),
    {
      method: 'POST',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `f.req=${JSON.stringify([
        [['MkEWBc', JSON.stringify([[text, from, to, 1], []]), null, 'generic']],
      ])}`,
    },
  ],
  extraSourceLanguages: ['auto'],
  parse: async (res) => {
    if (!res.ok) throw new Error(`http ${res.status}`)

    return await res.text().then((_) => {
      const rawBody: [['wrb.fr', 'MkEWBc', string, null, null, null, 'generic']] = JSON.parse(
        _.replace(")]}'", '').trim(),
      )

      const body: [unknown, [[[null, null, null, null, null, [[string]]]]]] = JSON.parse(
        rawBody[0][2],
      )

      const translation = body?.[1]?.[0]?.[0]?.[5]
        ?.map?.((translation) => translation[0])
        ?.join?.('')

      if (!translation) throw new Error('no response')

      return translation
    })
  },
}

/** the same one used in the Google Dictionary extension */
export const google_dict_chrome_ex: Engine = {
  needkey: false,
  fetch: ({ from: sl, to: tl, text: q }) => [
    new URL(
      `translate_a/t?${new URLSearchParams({ client: 'dict-chrome-ex', sl, tl, q })}`,
      'https://clients5.google.com',
    ),
  ],
  extraSourceLanguages: ['auto'],
  parse: async (res) => {
    if (!res.ok) throw new Error(`http ${res.status}`)

    return await res.json().then((_) => {
      // translation, detected language
      const body = _ as [[string, string?]]

      if (!body?.[0]?.[0]) throw new Error('no response')

      return body[0][0]
    })
  },
}

export const google_cloud: Engine = {
  needkey: true,
  fetch: ({ from: source, key, text: q, to: target }) => [
    new URL(
      `language/translate/v2?${new URLSearchParams({
        key,
        model: 'nmt',
        q,
        source,
        target,
      })}`,
    ),
  ],
  extraSourceLanguages: ['auto'],
  parse: async (res) => {
    if (!res.ok) throw new Error(`http ${res.status}`)

    return await res.json().then((_) => {
      const body = _ as {
        data: {
          translations: Array<{ translatedText: string }>
        }
      }

      if (!body?.data?.translations) throw new Error('no response')

      return body.data.translations.map(({ translatedText }) => translatedText).join('')
    })
  },
}
