import { LanguageCode } from 'iso-639-1'
import { LiteralUnion } from 'type-fest'

import defaultEngines from './engines'

export interface EngineFetchOptions<NeedKey extends boolean> {
  from: LiteralUnion<LanguageCode, string>
  overrideParams?: Record<string, string>
  key: NeedKey extends true ? string : string | undefined
  text: string
  to: LiteralUnion<LanguageCode, string>
  url?: string
}

export interface EngineWithKey {
  fetch: (options: EngineFetchOptions<true>) => [string | URL, RequestInit?]

  extraSourceLanguages?: string[]
  extraTargetLanguages?: string[]

  needkey: true

  parse: (res: Response) => string | Promise<string>
}

export interface EngineWithoutKey extends Omit<EngineWithKey, 'fetch' | 'needkey'> {
  fetch: (options: EngineFetchOptions<false>) => [string | URL, RequestInit?]

  needkey: false
}

export type Engine = EngineWithKey | EngineWithoutKey

export interface Options<
  Engines extends Record<string, Engine> = Record<never, Engine>,
  EngineName extends LiteralUnion<keyof typeof defaultEngines, keyof Engines> = LiteralUnion<
    keyof typeof defaultEngines,
    keyof Engines
  >,
> {
  /** source text language, default: 'en' */
  from?: LiteralUnion<LanguageCode, string>
  /** target language, default: 'en' */
  to?: LiteralUnion<LanguageCode, string>

  /** api key */
  key?: string

  /** translation engine name, default: 'google' */
  engine?: EngineName
  /** custom engines definition */
  engines?: Engines

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
