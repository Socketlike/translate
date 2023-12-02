# translate

an opinionated API for translator engines (fork of `github:franciscop/translate`)

## Original description

Convert text to different languages on Node.js and the browser. Flexible package that allows you to
use Google (default), [Yandex](https://translate.yandex.com/), [Libre](https://libretranslate.com/)
or [DeepL](https://www.deepl.com/en/translator)

## What are the differences of this fork and upstream?

- [Lingva](https://lingva.ml) support
- Written in TypeScript and hopefully has better typings
- Uses `iso-639-1` instead of hardcoded list (exported as `Languages`)
- Dropped support for `ISO-639-2`
- Dropped support for "prop options":
  ```js
  translate.engine = 'deepl' // does nothing, still uses 'google'
  translate(text, { engine: 'deepl' }) // uses 'deepl'
  ```

## Getting started

Install:

```bash
npm install @sckt/translate
pnpm install @sckt/translate
...
```

Import:

```js
import translate from '@sckt/translate'
```

Usage:

```js
import translate from 'translate'

const text = await translate('Hello world', {
  engine: 'deepl',
  key: process.env.DEEPL_KEY,
  to: 'es',
})

console.log(text) // "Hola mundo"
```

## Options

```ts
export interface Options<CustomEngines extends Record<string, Engine> = Record<string, Engine>> {
  /** source language - default: 'en' */
  from?: LiteralUnion<LanguageCode, string>
  /** target language - default: 'en' */
  to?: LiteralUnion<LanguageCode, string>

  /** api key */
  key?: string

  /** translation engine name - default: 'google' */
  engine?: keyof typeof defaultEngines | keyof CustomEngines
  /** custom engines definition */
  engines?: CustomEngines

  /** custom url for specific engines */
  url?: string

  /** cache expiration time, default: never */
  cache?: number
}
```

## Engines

Default engines (use by setting the `engine` option):

- **`google`**: ([demo](https://translate.google.com/) |
  [docs](https://cloud.google.com/translate/docs/)): Google Translate.
- **`yandex`**: ([demo](https://translate.yandex.com/) | [docs](https://tech.yandex.com/translate/)
  | [API Key](https://translate.yandex.com/developers/keys)): Yandex Translate
- **`libre`**: ([demo](https://libretranslate.com/)): An independent translation engine. You can use
  the official website or install it on your own server.
- **`lingva`**: ([demo](https://lingva.ml/)): Alternative front-end for Google Translate, serving as
  a Free and Open Source translator with over a hundred languages available.
- **`deepl`**: ([demo](https://www.deepl.com/en/translator)): A rapidly growing popular translation
  engine built with Machine Learning.

Custom engines:

```ts
import translate, { Engine } from '@sckt/translate'

/**
 * imagine in your head that we have a translation engine hosted at `localhost`,
 *
 * endpoint is `localhost/v1/translate`
 *
 * takes a body of shape: {
 *   from: string,
 *   to: string,
 *   text: string,
 * }
 *
 * then responds with: {
 *   translation?: string;
 *   error?: string;
 * }
 *
 * with this info, we may now create our own engine implementation:
 **/
const localhost: Engine = {
  needkey: false,
  fetch: ({ from, text, to }) => [
    new URL('api/v1/translate', 'http://127.0.0.1'),
    {
      method: 'POST',
      body: JSON.stringify({
        from,
        to,
        text,
      }),
    },
  ],
  extraSourceLanguages: ['auto'],
  parse: (res) =>
    res.json().then((_) => {
      // tfw we can't cast unknown to something else in func args
      const body = _ as { translation?: string; error?: string }

      if (!body?.translation) throw new Error('no response')
      if (body.error) throw new Error(body.error)

      return body.translation
    }),
}

// we may now use the engine impl we created
await translate('test', { engines: { localhost }, engine: 'localhost', from: 'auto' })
  .then(console.log)
  .catch(console.error)
```

## Acknowledgement (upstream)

Current package and development: [Francisco Presencia](https://francisco.io/)

Original package and idea: Andrew Lunny (alunny), Marak Squires, Google

Testing in Internet Explorer supported by BrowserStack:

[![BrowserStack logo](https://i.imgur.com/CuCuOkL.png)](https://browserstack.com/)
