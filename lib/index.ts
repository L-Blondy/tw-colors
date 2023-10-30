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

type DefaultThemeObject<ThemeName = any> = {
   light: NoInfer<ThemeName> | (string & {});
   dark: NoInfer<ThemeName> | (string & {});
};

type ResolvedVariants = Array<{ name: string; definition: string[] }>;
type ResolvedUtilities = { [selector: string]: Record<string, any> };
type ResolvedColors = {
   [colorName: string]: ({
      opacityValue,
      opacityVariable,
   }: {
      opacityValue: string;
      opacityVariable: string;
   }) => string;
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
   defaultTheme?: NoInfer<ThemeName> | (string & {}) | DefaultThemeObject<ThemeName>;
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
      defaultTheme,
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
      const isDefault = themeName === defaultTheme;

      const flatColors = flattenColors(colors);
      // set the resolved.variants
      resolved.variants.push({
         name: themeVariant,
         // tailwind will generate only the first matched definition
         definition: [
            `.${themeClassName}&`,
            `:is(.${themeClassName} > &:not([data-theme]))`,
            `:is(.${themeClassName} &:not(.${themeClassName} [data-theme]:not(.${themeClassName}) * ))`,
            `:is(.${themeClassName}:not(:has([data-theme])) &:not([data-theme]))`, // See the browser support: https://caniuse.com/css-has
            `[data-theme='${themeName}']&`,
            `:is([data-theme='${themeName}'] > &:not([data-theme]))`,
            `:is([data-theme='${themeName}'] &:not([data-theme='${themeName}'] [data-theme]:not([data-theme='${themeName}']) * ))`,
            `:is([data-theme='${themeName}']:not(:has([data-theme])) &:not([data-theme]))`, // See the browser support: https://caniuse.com/css-has
            typeof defaultTheme === 'string' &&
               themeName === defaultTheme && [
                  `:root&`,
                  `:is(:root > &:not([data-theme]))`,
                  `:is(:root &:not([data-theme] *):not([data-theme]))`,
               ],
            typeof defaultTheme === 'object' &&
               themeName === defaultTheme.light && [
                  `@media (prefers-color-scheme: light){:root&}`,
                  `@media (prefers-color-scheme: light){:is(:root > &:not([data-theme]))}`,
                  `@media (prefers-color-scheme: light){:is(:root &:not([data-theme] *):not([data-theme]))}`,
               ],
            typeof defaultTheme === 'object' &&
               themeName === defaultTheme.dark && [
                  `@media (prefers-color-scheme: dark){:root&}`,
                  `@media (prefers-color-scheme: dark){:is(:root > &:not([data-theme]))}`,
                  `@media (prefers-color-scheme: dark){:is(:root &:not([data-theme] *):not([data-theme]))}`,
               ],
         ]
            .flat()
            .filter(Boolean) as string[],
      });

      const cssSelector = `.${themeClassName},[data-theme="${themeName}"]`;
      // set the color-scheme css property
      resolved.utilities[cssSelector] = colors[SCHEME] ? { 'color-scheme': colors[SCHEME] } : {};

      forEach(flatColors, (colorValue, colorName) => {
         // this case was handled above
         if ((colorName as any) === SCHEME) return;
         const safeColorName = escapeChars(colorName, '/');
         let [h, s, l, defaultAlphaValue]: HslaArray = [0, 0, 0, 1];
         try {
            [h, s, l, defaultAlphaValue = 1] = toHslaArray(colorValue);
         } catch (error: any) {
            const message = `\r\nWarning - In theme "${themeName}" color "${colorName}". ${error.message}`;

            if (strict) {
               throw new Error(message);
            }
            return console.error(message);
         }
         const twcColorVariable = produceCssVariable(safeColorName);
         const twcOpacityVariable = `${produceCssVariable(safeColorName)}-opacity`;
         // add the css variables in "@layer utilities" for the hsl values
         const hslValues = `${h} ${s}% ${l}%`;
         resolved.utilities[cssSelector][twcColorVariable] = hslValues;
         setWhenDefault(twcColorVariable, hslValues, { defaultTheme, resolved, themeName });
         // add the css variables in "@layer utilities" for the alpha
         const alphaValue = defaultAlphaValue.toFixed(2);
         resolved.utilities[cssSelector][twcOpacityVariable] = alphaValue;
         setWhenDefault(twcOpacityVariable, alphaValue, { defaultTheme, resolved, themeName });
         // set the dynamic color in tailwind config theme.colors
         resolved.colors[colorName] = ({ opacityVariable, opacityValue }) => {
            // if the opacity is set  with a slash (e.g. bg-primary/90), use the provided value
            if (!isNaN(+opacityValue)) {
               return `hsl(var(${twcColorVariable}) / ${opacityValue})`;
            }
            // if no opacityValue was provided (=it is not parsable to a number)
            // the twcOpacityVariable (opacity defined in the color definition rgb(0, 0, 0, 0.5))
            // should have the priority over the tw class based opacity(e.g. "bg-opacity-90")
            // This is how tailwind behaves as for v3.2.4
            if (opacityVariable) {
               return `hsl(var(${twcColorVariable}) / var(${twcOpacityVariable}, var(${opacityVariable})))`;
            }
            return `hsl(var(${twcColorVariable}) / var(${twcOpacityVariable}, 1))`;
         };
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
      ({ addUtilities, addVariant, matchVariant }) => {
         // add the css variables to "@layer utilities"
         // Why ?
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
               // @ts-ignore tailwind types are broken
               colors: resolved.colors,
            },
         },
      },
   );
};

function escapeChars(str: string, ...chars: string[]) {
   let result = str;
   for (let char of chars) {
      const regexp = new RegExp(char, 'g');
      result = str.replace(regexp, '\\' + char);
   }
   return result;
}

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

function toHslaArray(colorValue?: string) {
   return Color(colorValue).hsl().round(1).array() as HslaArray;
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

function setWhenDefault(
   key: string,
   value: string,
   {
      resolved,
      defaultTheme,
      themeName,
   }: {
      resolved: Resolved;
      defaultTheme: string | DefaultThemeObject | undefined;
      themeName: string;
   },
) {
   if (!defaultTheme) return;
   if (typeof defaultTheme === 'string') {
      if (themeName === defaultTheme) {
         if (!resolved.utilities[':root']) {
            resolved.utilities[':root'] = {};
         }
         resolved.utilities[':root'][key] = value;
      }
   } else if (themeName === defaultTheme.light) {
      if (!resolved.utilities['@media (prefers-color-scheme: light)']) {
         resolved.utilities['@media (prefers-color-scheme: light)'] = {
            ':root': {},
         };
      }
      resolved.utilities['@media (prefers-color-scheme: light)'][':root'][key] = value;
   } else if (themeName === defaultTheme.dark) {
      if (!resolved.utilities['@media (prefers-color-scheme: dark)']) {
         resolved.utilities['@media (prefers-color-scheme: dark)'] = {
            ':root': {},
         };
      }
      resolved.utilities['@media (prefers-color-scheme: dark)'][':root'][key] = value;
   }
}

interface MaybeNested<K extends keyof any = string, V extends string = string> {
   [key: string]: V | MaybeNested<K, V>;
}

type NoInfer<T> = [T][T extends any ? 0 : never];

type HslaArray = [number, number, number, number | undefined];

// TODO: remove

createThemes(
   {
      light: { primary: 'red' },
      dark: { primary: 'red' },
   },
   { defaultTheme: 'dark' },
);

createThemes(
   {
      light: { primary: 'red' },
      dark: { primary: 'red' },
   },
   { defaultTheme: 'light' },
);

createThemes(
   {
      light1: { primary: 'red' },
      dark2: { primary: 'red' },
   },
   { defaultTheme: { light: 'light1', dark: 'dark2' } },
);
createThemes(
   () => ({
      light1: { primary: 'red' },
      dark2: { primary: 'red' },
   }),
   { defaultTheme: { light: 'light1', dark: 'dark2' } },
);
createThemes(
   ({ light, dark }) => ({
      light1: light({ primary: 'red' }),
      dark2: dark({ primary: 'red' }),
   }),
   { defaultTheme: { light: 'light1', dark: 'dark2' } },
);
