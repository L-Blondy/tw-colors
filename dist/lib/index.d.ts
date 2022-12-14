declare const SCHEME: unique symbol;
export interface Colors extends Record<string, string> {
}
export interface ColorsWithScheme<T> extends Colors {
    [SCHEME]: T;
}
type SingleThemeConfig = Colors | ColorsWithScheme<'light' | 'dark'>;
type SchemerFn<T> = (colors: Colors) => ColorsWithScheme<T>;
export type ConfigObject = Record<string, SingleThemeConfig>;
export type ConfigFunction = ({ light, dark, }: {
    light: SchemerFn<'light'>;
    dark: SchemerFn<'dark'>;
}) => ConfigObject;
export declare const createThemes: (config?: ConfigObject | ConfigFunction) => {
    handler: import("tailwindcss/types/config").PluginCreator;
    config?: Partial<import("tailwindcss/types/config").Config> | undefined;
};
export {};
