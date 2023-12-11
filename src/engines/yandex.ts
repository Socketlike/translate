import { Engine } from '@types'

export const yandex: Engine = {
  needkey: true,
  fetch: ({ key, from, to, text }) => [
    new URL(
      `api/v1.5/tr.json/translate?${new URLSearchParams({ key, lang: `${from}-${to}`, text })}`,
      'https://translate.yandex.net',
    ),
    { method: 'POST' },
  ],
  parse: (res) =>
    res.json().then((_) => {
      const body = _ as { code: number; message: string; text: string[] }

      if (body.code !== 200) throw new Error(body.message)

      return body.text[0]
    }),
}
