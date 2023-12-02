import { Engine } from '@types'

export const google: Engine = {
  needkey: false,
  fetch: ({ from, to, text }) => [
    new URL(
      `translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${text}`,
      'https://translate.googleapis.com',
    ),
  ],
  parse: (res) =>
    res.json().then((_) => {
      const body = _ as string[][]
      const translation = body?.[0]?.[0] && body[0].map((t) => t[0]).join('')

      if (!translation) throw new Error('translation not found')

      return translation
    }),
}
