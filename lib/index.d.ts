export type TwColorsConfig = Record<string, Record<string, string>>;

export function createThemes(config?: TwColorsConfig): {
   handler: import('tailwindcss/types/config').PluginCreator;
   config?: Partial<import('tailwindcss/types/config').Config>;
};
