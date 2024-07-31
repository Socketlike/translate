import { deepl } from './deepl'
import { google, google_batchexecute, google_dict_chrome_ex } from './google'
import { libre } from './libre'
import { lingva } from './lingva'
import { simplytranslate } from './simplytranslate'
import { yandex } from './yandex'

export default {
  deepl,
  google,
  google_batchexecute,
  google_dict_chrome_ex,
  libre,
  lingva,
  simplytranslate,
  yandex,
} as const
