import Color from 'color';
import plugin from 'tailwindcss/plugin';
import forEach from 'lodash.foreach';
import flatten from 'flat';

interface MaybeNested<K extends keyof any = string, V = string> {
   [key: string]: V | MaybeNested<K, V>;
}

const SCHEME = Symbol('color-scheme');
const VAR_PREFIX = 'twc';

export type Colors = MaybeNested<string, string>;

export interface ColorsWithScheme<T> extends Colors {
   [SCHEME]?: T;
}

interface FlatColorsWithScheme<T> extends Record<string, string> {
   [SCHEME]?: T;
}

type SchemerFn<T> = (colors: Colors) => ColorsWithScheme<T>;

const dark: SchemerFn<'dark'> = (colors) => {
   return {
      [SCHEME]: 'dark',
      ...colors,
   };
};

const light: SchemerFn<'light'> = (colors) => {
   return {
      [SCHEME]: 'light',
      ...colors,
   };
};

type HslaArray = [number, number, number, number | undefined];

export const toHslaArray = (colorValue?: string): HslaArray => {
   return Color(colorValue).hsl().round(1).array() as HslaArray;
};

export type ConfigObject = Record<string, ColorsWithScheme<'light' | 'dark'>>;
export type ConfigFunction = ({
   light,
   dark,
}: {
   light: SchemerFn<'light'>;
   dark: SchemerFn<'dark'>;
}) => ConfigObject;

export interface Options {
   cssVariablePrefix?: string;
   cssVariableSuffix?: string;
}

export const resolveConfig = (
   config: ConfigObject | ConfigFunction = {},
   { cssVariablePrefix = 'twc-', cssVariableSuffix = '' }: Options = {},
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

   forEach(configObject, (colors: ColorsWithScheme<'light' | 'dark'>, themeName: string) => {
      const cssSelector = `.theme-${themeName},[data-theme="${themeName}"]`;

      resolved.utilities[cssSelector] = colors[SCHEME]
         ? {
              'color-scheme': colors[SCHEME],
           }
         : {};

      // flatten color definitions
      const flatColorsWithDEFAULT: FlatColorsWithScheme<'light' | 'dark'> = flatten(colors, {
         safe: true,
         delimiter: '-',
      });

      const flatColors = Object.entries(flatColorsWithDEFAULT).reduce((acc, [key, value]) => {
         acc[key.replace(/\-DEFAULT$/, '')] = value;
         return acc;
      }, {} as FlatColorsWithScheme<'dark' | 'light'>);

      // resolved.variants
      resolved.variants.push({
         name: `theme-${themeName}`,
         definition: [`&.theme-${themeName}`, `&[data-theme='${themeName}']`],
      });

      forEach(flatColors, (colorValue, colorName) => {
         // this case was handled above
         if ((colorName as any) === SCHEME) return;
         const safeColorName = escapeChars(colorName, '/');
         const [h, s, l, defaultAlphaValue] = toHslaArray(colorValue);
         const twcColorVariable = `--${cssVariablePrefix}${safeColorName}${cssVariableSuffix}`;
         const twcOpacityVariable = `--${cssVariablePrefix}${safeColorName}-opacity${cssVariableSuffix}`;
         // set the css variable in "@layer utilities"
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
            // the twcOpacityVariable (opacity defined in the color definition rgb(0, 0, 0, 0.5)) should have the priority
            // over the tw class based opacity(e.g. "bg-opacity-90")
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

export const createThemes = (config: ConfigObject | ConfigFunction = {}, options: Options = {}) => {
   const resolved = resolveConfig(config, options);

   return plugin(
      ({ addUtilities, addVariant }) => {
         // add the css variables to "@layer utilities"
         addUtilities(resolved.utilities);
         // add the theme as variant e.g. "theme-[name]:text-2xl"
         resolved.variants.forEach((variant) => {
            addVariant(variant.name, variant.definition);
         });
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
