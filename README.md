# translate

an opinionated API for translator engines (fork of `github:franciscop/translate`)

## Original description

Convert text to different languages on Node.js and the browser. Flexible package that allows you to
use Google (default), [Yandex](https://translate.yandex.com/), [Libre](https://libretranslate.com/)
or [DeepL](https://www.deepl.com/en/translator)

## What are the differences of this fork and upstream?

- [Lingva](https://lingva.ml) support
- [Google's `TranslateWebserverUi` endpoint (Google Translate webapp)](https://translate.google.com)
  , `client5.google.com/translate_a/t` endpoint (Google Dictionary browser extension) and
  [Google Cloud Translation REST API](https://cloud.google.com/translate/docs/reference/rest/v2/translate)
  support
- [SimplyTranslate](https://simplytranslate.org) support
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

This is a simplified version of `Options` & `Engine` and does not accurately represent its typings.

```ts
interface EngineFetchOptions<NeedKey extends boolean> {
  from: string
  overrideParams?: Record<string, string>
  key: NeedKey extends true ? string : string | undefined
  text: string
  to: string
  url?: string
}

interface EngineWithKey {
  fetch: (
    options: EngineFetchOptions<true>,
  ) => [string | URL, RequestInit?] /* global.fetch() props */

  extraSourceLanguages?: string[]
  extraTargetLanguages?: string[]

  needkey: true

  parse: (res: Response) => string | Promise<string>
}

interface EngineWithoutKey extends Omit<EngineWithKey, 'fetch' | 'needkey'> {
  fetch: (
    options: EngineFetchOptions<false>,
  ) => [string | URL, RequestInit?] /* global.fetch() props */

  needkey: false
}

interface Options {
  /** source text language, default: 'en' */
  from?: string
  /** target language, default: 'en' */
  to?: string

  /** api key, required for  */
  key?: string

  /** translation engine name, default: 'google' */
  engine?: string
  /** custom engines definition */
  engines?: Record<string, EngineWithKey | EngineWithoutKey>

  /** custom url for specific engines */
  url?: string

  /**
   * override for url params for engines that supports it,
   * e.g. simplytranslate:
   *
   * @example
   * translate(
   *   'test',
   *   {
   *    engine: 'simplytranslate',
   *    to: 'es',
   *    // tells SimplyTranslate to use the `reverso` engine
   *    // without override: https://simplytranslate.org/api/translate?engine=google...
   *    // with override: https://simplytranslate.org/api/translate?engine=reverso...
   *    overrideParams: { engine: 'reverso' }
   *   }
   * )
   **/
  overrideParams?: Record<string, string>

  /** cache expiration time, default: never */
  cache?: number
}
```

## Engines

Default engines (used in the `engine` option):

- **`deepl`**: ([demo](https://www.deepl.com/en/translator)): A rapidly growing popular translation
  engine built with Machine Learning.
- **`google`**: ([demo](https://translate.google.com/) |
  [docs](https://cloud.google.com/translate/docs/)): Google Translate.
- **`google_batchexecute`**: ([demo](https://translate.google.com)): Google Translate (used for the
  Translate webapp, **doesn't work if Referer or Origin header is set to something else other than
  translate.google.com?**)
- **`google_dict_chrome_ex`**: Google Translate (Google Dictionary browser extension)
- **`google_cloud`**: ([docs](https://cloud.google.com/translate/docs/reference/rest/v2/translate))
  Google Cloud Translation REST API.
- **`libre`**: ([demo](https://libretranslate.com/)): An independent translation engine. You can use
  the official website or install it on your own server.
- **`lingva`**: ([demo](https://lingva.ml/)): Alternative front-end for Google Translate, serving as
  a Free and Open Source translator with over a hundred languages available.
- **`simplytranslate`**: ([demo](https://simplytranslate.org)): A privacy friendly frontend for
  multiple Translation Websites.
- **`yandex`**: ([demo](https://translate.yandex.com/) | [docs](https://tech.yandex.com/translate/)
  | [API Key](https://translate.yandex.com/developers/keys)): Yandex Translate

Custom engines:

```ts
import translate, { Engine } from '@sckt/translate'

/**
 * for example, let's say we have a translator engine hosted at `localhost`,
 *
 * endpoint is `api/v1/translate`, method is POST
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
      // since _ is unknown and we cannot cast it in the arguments, we must cast it here
      const body = _ as { translation?: string; error?: string }

      if (!body?.translation) throw new Error('no response')
      if (body.error) throw new Error(body.error)

      return body.translation
    }),
}

// we may now use the engine impl we created
await translate('test', {
  engines: { localhost },
  engine: 'localhost',
  to: 'es',
})
  .then(console.log)
  .catch(console.error)
```

## Acknowledgement

- [libmozhi](https://codeberg.org/aryak/libmozhi) for its Google Translate frontend implementation

## Acknowledgement (upstream)

Current package and development: [Francisco Presencia](https://francisco.io/)

Original package and idea: Andrew Lunny (alunny), Marak Squires, Google

Testing in Internet Explorer supported by BrowserStack:

[![BrowserStack logo](https://i.imgur.com/CuCuOkL.png)](https://browserstack.com/)
