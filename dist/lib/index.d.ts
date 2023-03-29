import * as tailwindcss_types_config from 'tailwindcss/types/config';

interface MaybeNested<K extends keyof any = string, V = string> {
    [key: string]: V | MaybeNested<K, V>;
}
declare const SCHEME: unique symbol;
type Colors = MaybeNested<string, string>;
interface ColorsWithScheme<T> extends Colors {
    [SCHEME]?: T;
}
type SchemerFn<T> = (colors: Colors) => ColorsWithScheme<T>;
type ConfigObject = Record<string, ColorsWithScheme<'light' | 'dark'>>;
type ConfigFunction = ({ light, dark, }: {
    light: SchemerFn<'light'>;
    dark: SchemerFn<'dark'>;
}) => ConfigObject;
declare const resolveConfig: (config?: ConfigObject | ConfigFunction) => {
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
declare const createThemes: (config?: ConfigObject | ConfigFunction) => {
    handler: tailwindcss_types_config.PluginCreator;
    config?: Partial<tailwindcss_types_config.Config> | undefined;
};

export { Colors, ColorsWithScheme, ConfigFunction, ConfigObject, createThemes, resolveConfig };
