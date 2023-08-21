import Color from 'color';
import plugin from 'tailwindcss/plugin';
import forEach from 'lodash.foreach';
import flatten from 'flat';

const SCHEME = Symbol('color-scheme');

type ThemeName = string;
type NestedColors = { [SCHEME]?: 'light' | 'dark' } & MaybeNested<string, string>;
type FlatColors = { [SCHEME]?: 'light' | 'dark' } & Record<string, string>;
type TwcObjectConfig = Record<ThemeName, NestedColors>;
type TwcFunctionConfig = (scheme: { light: typeof light; dark: typeof dark }) => TwcObjectConfig;

export type TwcConfig = TwcObjectConfig | TwcFunctionConfig;

export interface TwcOptions {
   getCssVariable?: (themeName: string) => string;
   getThemeClassName?: (themeName: string) => string;
}

export const resolveTwcConfig = (
   config: TwcConfig = {},
   {
      getCssVariable = defaultGetCssVariable,
      getThemeClassName = defaultGetThemeClassName,
   }: TwcOptions = {},
) => {
   const resolved: {
      variants: { name: string; definition: string[] }[];
      utilities: Record<string, Record<string, string>>;
      colors: Record<
         string,
         ({
            opacityValue,
            opacityVariable,
         }: {
            opacityValue: string;
            opacityVariable: string;
         }) => string
      >;
   } = {
      variants: [],
      utilities: {},
      colors: {},
   };
   const configObject = typeof config === 'function' ? config({ dark, light }) : config;

   forEach(configObject, (colors: NestedColors, themeName: ThemeName) => {
      const themeClassName = getThemeClassName(themeName);
      const cssSelector = `.${themeClassName},[data-theme="${themeName}"]`;
      const flatColors = flattenColors(colors);

      // set the resolved.variants
      resolved.variants.push({
         name: `${themeClassName}`,
         definition: [`&.${themeClassName}`, `&[data-theme='${themeName}']`],
      });

      // set the color-scheme css property
      resolved.utilities[cssSelector] = colors[SCHEME] ? { 'color-scheme': colors[SCHEME] } : {};

      forEach(flatColors, (colorValue, colorName) => {
         // this case was handled above
         if ((colorName as any) === SCHEME) return;
         const safeColorName = escapeChars(colorName, '/');
         const [h, s, l, defaultAlphaValue] = toHslaArray(colorValue);
         const twcColorVariable = getCssVariable(safeColorName);
         const twcOpacityVariable = `${getCssVariable(safeColorName)}-opacity`;
         // add the css variable in "@layer utilities"
         resolved.utilities[cssSelector]![twcColorVariable] = `${h} ${s}% ${l}%`;
         // if an alpha value was provided in the color definition, store it in a css variable
         if (typeof defaultAlphaValue === 'number') {
            resolved.utilities[cssSelector]![twcOpacityVariable] = defaultAlphaValue.toFixed(2);
         }
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

export const createThemes = (config: TwcConfig = {}, options: TwcOptions = {}) => {
   const resolved = resolveTwcConfig(config, options);

   return plugin(
      ({ addUtilities, addVariant }) => {
         // add the css variables to "@layer utilities"
         addUtilities(resolved.utilities);
         // add the theme as variant e.g. "theme-[name]:text-2xl"
         resolved.variants.forEach(({ name, definition }) => addVariant(name, definition));
      },
      // extend the colors config
      {
         theme: {
            extend: {
               // @ts-ignore
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
   return Color(colorValue).hsl().round(1).array() as [number, number, number, number | undefined];
}

function defaultGetCssVariable(themeName: string) {
   return `--twc-${themeName}`;
}

function defaultGetThemeClassName(themeName: string) {
   return `theme-${themeName}`;
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

interface MaybeNested<K extends keyof any = string, V = string> {
   [key: string]: V | MaybeNested<K, V>;
}
