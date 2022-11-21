import Color from 'color';
import plugin from 'tailwindcss/plugin';
import forEach from 'lodash.foreach';

const SCHEME = Symbol('color-scheme');
const VAR_PREFIX = 'twc';
const RULE_PREFIX = '.twc-rule';

export interface Colors extends Record<string, string> {}

export interface ColorsWithScheme<T> extends Colors {
   [SCHEME]: T;
}

type SingleThemeConfig = Colors | ColorsWithScheme<'light' | 'dark'>;

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

function toHslContent(color: string) {
   const [h, s, l] = Color(color).hsl().round().array();
   return `${h} ${s}% ${l}%`;
}

export type ConfigObject = Record<string, SingleThemeConfig>;
export type ConfigFunction = ({
   light,
   dark,
}: {
   light: SchemerFn<'light'>;
   dark: SchemerFn<'dark'>;
}) => ConfigObject;

export const createThemes = (config: ConfigObject | ConfigFunction = {}) => {
   const resolved: {
      variants: { name: string; definition: string[] }[];
      utilities: Record<string, Record<string, string>>;
      colors: Record<string, string>;
   } = {
      variants: [],
      utilities: {},
      colors: {},
   };
   const configObject = typeof config === 'function' ? config({ dark, light }) : config;

   forEach(configObject, (colors: SingleThemeConfig, themeName: string) => {
      const cssSelector = `${RULE_PREFIX},.theme-${themeName},[data-theme="${themeName}"]`;

      resolved.utilities[cssSelector] = {
         'color-scheme': (colors as ColorsWithScheme<'light' | 'dark'>)[SCHEME] || 'initial',
      };

      // resolved.variants
      resolved.variants.push({
         name: `-theme-${themeName}`,
         definition: [`&.theme-${themeName}`, `&[data-theme='${themeName}']`],
      });

      forEach(colors, (colorValue, colorName) => {
         // this case was handled above
         if ((colorName as any) === SCHEME) return;
         // set the css variable in "@layer utilities"
         resolved.utilities[cssSelector]![`--${VAR_PREFIX}-${colorName}`] =
            toHslContent(colorValue);
         // set the dynamic color in tailwind config theme.colors
         resolved.colors[colorName] = `hsl(var(--${VAR_PREFIX}-${colorName}) / <alpha-value>)`;
      });
   });

   return plugin(
      ({ addUtilities, addVariant }) => {
         // add the css variables to "@layer utilities"
         addUtilities(resolved.utilities);
         // add the theme as variant e.g. "theme-[name]:text-2xl"
         resolved.variants.forEach((variant) => {
            console.log(variant.name, variant.definition);
            addVariant(variant.name, variant.definition);
         });
      },
      // extend the colors config
      { theme: { extend: { colors: resolved.colors } } },
   );
};
