import ISO6391 from 'iso-639-1'

import cache from 'memory-cache'

import defaultEngines from '@engines'
import { Engine, Options } from '@types'

export const translate = async <Engines extends Record<string, Engine> = Record<string, Engine>>(
  text: string,
  options?: Options<Engines> | string,
): Promise<string> => {
  const {
    url,
    key,
    cache: cacheTime,
    ...opt
  } = {
    from: 'en',
    to: 'en',
    engine: 'google',
    ...(typeof options === 'string' ? { to: options } : options),
  }

  const engines = {
    ...defaultEngines,
    ...opt.engines!,
  }

  const engineName = opt.engine || 'google'
  const engine = engines[engineName]

  if (!engine) throw new Error(`invalid engine ${String(engineName)}`)

  const fromRaw = opt.from || typeof opt.from === 'string' ? opt.from : 'en'
  const from =
    (engine.extraSourceLanguages?.includes?.(fromRaw) || ISO6391.validate(fromRaw)) && fromRaw

  const toRaw = opt.to || typeof opt.to === 'string' ? opt.to : 'en'
  const to = (engine.extraTargetLanguages?.includes?.(toRaw) || ISO6391.validate(toRaw)) && toRaw

  if (typeof from !== 'string') throw new Error(`unsupported source language "${fromRaw}"`)

  if (typeof to !== 'string') throw new Error(`unsupported target language "${toRaw}"`)

  if (from === to) return text

  const id = `${url}:${from}:${to}:${String(engineName)}:${text}`
  const cached = cache.get(id)

  if (cached) return cached

  if (engine.needkey && !key) throw new Error(`engine ${String(engineName)} requires an API key`)

  return fetch(...engine.fetch({ from, to, key: key!, url, text }))
    .then(engine.parse)
    .then((translation) => cache.put(id, translation, cacheTime))
}

export * from '@types'

export default translate

export { default as Languages } from 'iso-639-1'
