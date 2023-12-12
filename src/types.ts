import { LanguageCode } from 'iso-639-1'
import { LiteralUnion } from 'type-fest'

import defaultEngines from '@engines'

export type Engine =
  | {
      fetch: (options: {
        from: LiteralUnion<LanguageCode, string>
        key: string
        text: string
        to: LiteralUnion<LanguageCode, string>
        url?: string
      }) => [string | URL, RequestInit?]
      extraSourceLanguages?: string[]
      extraTargetLanguages?: string[]
      needkey: true
      parse: (res: Response) => string | Promise<string>
    }
  | {
      fetch: (options: {
        from: LiteralUnion<LanguageCode, string>
        key?: string
        text: string
        to: LiteralUnion<LanguageCode, string>
        url?: string
      }) => [string | URL, RequestInit?]
      extraSourceLanguages?: string[]
      extraTargetLanguages?: string[]
      needkey: false
      parse: (res: Response) => string | Promise<string>
    }

export interface Options<
  Engines extends Record<string, Engine> = Record<never, Engine>,
  EngineName extends keyof typeof defaultEngines | keyof Engines =
    | keyof typeof defaultEngines
    | keyof Engines,
> {
  /** source language - default: 'en' */
  from?: LiteralUnion<LanguageCode, string>
  /** target language - default: 'en' */
  to?: LiteralUnion<LanguageCode, string>

  /** api key */
  key?: string

  /** translation engine name - default: 'google' */
  engine?: EngineName
  /** custom engines definition */
  engines?: Engines

  /** custom url for specific engines */
  url?: string

  /** cache expiration time, default: never */
  cache?: number
}
