import Color from 'color';
import plugin from 'tailwindcss/plugin';
import forEach from 'lodash.foreach';
import flatten from 'flat';

const SCHEME = Symbol('color-scheme');
const emptyConfig: TwcConfig = {};

type NestedColors = { [SCHEME]?: 'light' | 'dark' } & MaybeNested<string, string>;
type FlatColors = { [SCHEME]?: 'light' | 'dark' } & Record<string, string>;
type TwcObjectConfig<ThemeName extends string> = Record<ThemeName, NestedColors>;
type TwcFunctionConfig<ThemeName extends string> = (scheme: {
   light: typeof light;
   dark: typeof dark;
}) => TwcObjectConfig<ThemeName>;

type ResolvedVariants = Array<{ name: string; definition: string[] }>;
type ResolvedUtilities = { [selector: string]: Record<string, any> };
type ResolvedColors = {
   [colorName: string]: string;
};
type Resolved = {
   variants: ResolvedVariants;
   utilities: ResolvedUtilities;
   colors: ResolvedColors;
};

export type TwcConfig<ThemeName extends string = string> =
   | TwcObjectConfig<ThemeName>
   | TwcFunctionConfig<ThemeName>;

export interface TwcOptions<ThemeName extends string = string> {
   produceCssVariable?: (colorName: string) => string;
   produceThemeClass?: (themeName: ThemeName) => string;
   produceThemeVariant?: (themeName: ThemeName) => string;
   strict?: boolean;
}

/**
 * Resolves the variants, base and colors to inject in the plugin
 * Library authors might use this function instead of the createThemes function
 */
export const resolveTwcConfig = <ThemeName extends string>(
   config: TwcConfig<ThemeName> = emptyConfig,
   {
      produceCssVariable = defaultProduceCssVariable,
      produceThemeClass = defaultProduceThemeClass,
      produceThemeVariant = produceThemeClass,
      strict = false,
   }: TwcOptions<ThemeName> = {},
) => {
   const resolved: Resolved = {
      variants: [],
      utilities: {},
      colors: {},
   };
   const configObject = typeof config === 'function' ? config({ dark, light }) : config;
   // @ts-ignore forEach types fail to assign themeName
   forEach(configObject, (colors: NestedColors, themeName: ThemeName) => {
      const themeClassName = produceThemeClass(themeName);
      const themeVariant = produceThemeVariant(themeName);

      const flatColors = flattenColors(colors);
      // set the resolved.variants
      resolved.variants.push({
         name: themeVariant,
         // tailwind will generate only the first matched definition
         definition: generateVariantDefinitions(`.${themeClassName}`),
      });

      const cssSelector = `.${themeClassName}`;
      // set the color-scheme css property
      resolved.utilities[cssSelector] = colors[SCHEME] ? { 'color-scheme': colors[SCHEME] } : {};

      forEach(flatColors, (colorValue, colorName) => {
         // this case was handled above
         if ((colorName as any) === SCHEME) return;
         const safeColorName = colorName;
         let [h, s, l]: HslArray = [0, 0, 0];
         try {
            [h, s, l] = toHslArray(colorValue);
         } catch (error: any) {
            const message = `\r\nWarning - In theme "${themeName}" color "${colorName}". ${error.message}`;

            if (strict) {
               throw new Error(message);
            }
            return console.error(message);
         }
         const twcColorVariable = produceCssVariable(safeColorName);
         // add the css variables in "@layer utilities" for the hsl values
         const hslValues = `${h} ${s}% ${l}%`;
         resolved.utilities[cssSelector][twcColorVariable] = hslValues;
         // set the dynamic color in tailwind config theme.colors
         resolved.colors[colorName] = `hsl(var(${twcColorVariable}) / <alpha-value>)`;
      });
   });

   return resolved;
};

export const createThemes = <ThemeName extends string>(
   config: TwcConfig<ThemeName> = emptyConfig,
   options: TwcOptions<ThemeName> = {},
) => {
   const resolved = resolveTwcConfig(config, options);

   return plugin(
      ({ addUtilities, addVariant }) => {
         // add the css variables to "@layer utilities" because:
         // - The Base layer does not provide intellisense
         // - The Components layer might get overriden by tailwind default colors in case of name clash
         addUtilities(resolved.utilities);
         // add the theme as variant e.g. "theme-[name]:text-2xl"
         resolved.variants.forEach(({ name, definition }) => addVariant(name, definition));
      },
      // extend the colors config
      {
         theme: {
            extend: {
               colors: resolved.colors,
            },
         },
      },
   );
};

function flattenColors(colors: NestedColors) {
   const flatColorsWithDEFAULT: FlatColors = flatten(colors, {
      safe: true,
      delimiter: '-',
   });

   return Object.entries(flatColorsWithDEFAULT).reduce((acc, [key, value]) => {
      acc[key.replace(/\-DEFAULT$/, '')] = value;
      return acc;
   }, {} as FlatColors);
}

function toHslArray(colorValue?: string) {
   return Color(colorValue).hsl().round(1).array() as HslArray;
}

function defaultProduceCssVariable(themeName: string) {
   return `--twc-${themeName}`;
}

function defaultProduceThemeClass(themeName: string) {
   return themeName;
}

function dark(colors: NestedColors): { [SCHEME]: 'dark' } & MaybeNested<string, string> {
   return {
      ...colors,
      [SCHEME]: 'dark',
   };
}

function light(colors: NestedColors): { [SCHEME]: 'light' } & MaybeNested<string, string> {
   return {
      ...colors,
      [SCHEME]: 'light',
   };
}

function generateVariantDefinitions(selector: string) {
   return [
      `${selector}&`,
      `:is(${selector} > &:not([data-theme]))`,
      `:is(${selector} &:not(${selector} [data-theme]:not(${selector}) * ))`,
      `:is(${selector}:not(:has([data-theme])) &:not([data-theme]))`,
   ];
}

interface MaybeNested<K extends keyof any = string, V extends string = string> {
   [key: string]: V | MaybeNested<K, V>;
}

type HslArray = [number, number, number];
