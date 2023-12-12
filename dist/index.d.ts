import { LanguageCode } from 'iso-639-1';
export { default as Languages } from 'iso-639-1';
import { LiteralUnion } from 'type-fest';

declare const _default: {
    readonly deepl: Engine;
    readonly google: Engine;
    readonly google_batchexecute: Engine;
    readonly google_dict_chrome_ex: Engine;
    readonly libre: Engine;
    readonly lingva: Engine;
    readonly yandex: Engine;
};

type Engine = {
    fetch: (options: {
        from: LiteralUnion<LanguageCode, string>;
        key: string;
        text: string;
        to: LiteralUnion<LanguageCode, string>;
        url?: string;
    }) => [string | URL, RequestInit?];
    extraSourceLanguages?: string[];
    extraTargetLanguages?: string[];
    needkey: true;
    parse: (res: Response) => string | Promise<string>;
} | {
    fetch: (options: {
        from: LiteralUnion<LanguageCode, string>;
        key?: string;
        text: string;
        to: LiteralUnion<LanguageCode, string>;
        url?: string;
    }) => [string | URL, RequestInit?];
    extraSourceLanguages?: string[];
    extraTargetLanguages?: string[];
    needkey: false;
    parse: (res: Response) => string | Promise<string>;
};
interface Options<Engines extends Record<string, Engine> = Record<never, Engine>, EngineName extends keyof typeof _default | keyof Engines = keyof typeof _default | keyof Engines> {
    /** source language - default: 'en' */
    from?: LiteralUnion<LanguageCode, string>;
    /** target language - default: 'en' */
    to?: LiteralUnion<LanguageCode, string>;
    /** api key */
    key?: string;
    /** translation engine name - default: 'google' */
    engine?: EngineName;
    /** custom engines definition */
    engines?: Engines;
    /** custom url for specific engines */
    url?: string;
    /** cache expiration time, default: never */
    cache?: number;
}

declare const translate: <Engines extends Record<string, Engine> = Record<never, Engine>>(text: string, options?: Options<Engines, "deepl" | "google" | "google_batchexecute" | "google_dict_chrome_ex" | "libre" | "lingva" | "yandex" | keyof Engines> | undefined) => Promise<string>;

export { type Engine, type Options, translate as default, translate };
