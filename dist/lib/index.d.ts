interface MaybeNested<K extends keyof any = string, V = string> {
    [key: string]: V | MaybeNested<K, V>;
}
declare const SCHEME: unique symbol;
export type Colors = MaybeNested<string, string>;
export interface ColorsWithScheme<T> extends Colors {
    [SCHEME]?: T;
}
export interface FlatColorsWithScheme<T> extends Record<string, string> {
    [SCHEME]?: T;
}
type SchemerFn<T> = (colors: Colors) => ColorsWithScheme<T>;
export type ConfigObject = Record<string, ColorsWithScheme<'light' | 'dark'>>;
export type ConfigFunction = ({ light, dark, }: {
    light: SchemerFn<'light'>;
    dark: SchemerFn<'dark'>;
}) => ConfigObject;
export declare const resolveConfig: (config?: ConfigObject | ConfigFunction) => {
    variants: {
        name: string;
        definition: string[];
    }[];
    utilities: Record<string, Record<string, string>>;
    colors: Record<string, ({ opacityValue, opacityVariable, }: {
        opacityValue: string;
        opacityVariable: string;
    }) => string>;
};
export declare const createThemes: (config?: ConfigObject | ConfigFunction) => {
    handler: import("tailwindcss/types/config").PluginCreator;
    config?: Partial<import("tailwindcss/types/config").Config> | undefined;
};
export {};
