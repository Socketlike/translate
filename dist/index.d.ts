declare const _default: {
    readonly deepl: Engine;
    readonly google: Engine;
    readonly libre: Engine;
    readonly lingva: Engine;
    readonly yandex: Engine;
};

type Engine = {
    fetch: (options: {
        from: string;
        key: string;
        text: string;
        to: string;
        url?: string;
    }) => [string | URL, RequestInit?];
    extraSourceLanguages?: string[];
    extraTargetLanguages?: string[];
    needkey: true;
    parse: (res: Response) => string | Promise<string>;
} | {
    fetch: (options: {
        from: string;
        key?: string;
        text: string;
        to: string;
        url?: string;
    }) => [string | URL, RequestInit?];
    extraSourceLanguages?: string[];
    extraTargetLanguages?: string[];
    needkey: false;
    parse: (res: Response) => string | Promise<string>;
};
interface Options<CustomEngines extends Record<string, Engine> = Record<string, Engine>> {
    /** source language - default: 'en' */
    from?: string;
    /** target language - default: 'en' */
    to?: string;
    /** api key */
    key?: string;
    /** translation engine name - default: 'google' */
    engine?: keyof typeof _default | keyof CustomEngines;
    /** custom engines definition */
    engines?: CustomEngines;
    /** custom url for specific engines */
    url?: string;
    /** cache expiration time, default: never */
    cache?: number;
}

declare const translate: <CustomEngines extends Record<string, Engine> = Record<string, Engine>>(text: string, options?: Options<CustomEngines> | undefined) => Promise<string>;

export { Engine, Options, translate as default, translate };
