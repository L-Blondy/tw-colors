import Color from 'color';
import plugin from 'tailwindcss/plugin';
import forEach from 'lodash.foreach';

const SCHEME = Symbol('color-scheme');
const VAR_PREFIX = 'twc';

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

export type ConfigObject = Record<string, SingleThemeConfig>;
export type ConfigFunction = ({
   light,
   dark,
}: {
   light: SchemerFn<'light'>;
   dark: SchemerFn<'dark'>;
}) => ConfigObject;

export const resolveConfig = (config: ConfigObject | ConfigFunction = {}) => {
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

   forEach(configObject, (colors: SingleThemeConfig, themeName: string) => {
      const cssSelector = `.theme-${themeName},[data-theme="${themeName}"]`;

      resolved.utilities[cssSelector] = {
         'color-scheme': (colors as ColorsWithScheme<'light' | 'dark'>)[SCHEME] || 'initial',
      };

      // resolved.variants
      resolved.variants.push({
         name: `theme-${themeName}`,
         definition: [`&.theme-${themeName}`, `&[data-theme='${themeName}']`],
      });

      forEach(colors, (colorValue, colorName) => {
         // this case was handled above
         if ((colorName as any) === SCHEME) return;
         const [h, s, l, defaultAlphaValue] = Color(colorValue).hsl().round().array();
         const twcColorVariable = `--${VAR_PREFIX}-${colorName}`;
         const twcOpacityVariable = `--${VAR_PREFIX}-${colorName}-opacity`;
         // set the css variable in "@layer utilities"
         resolved.utilities[cssSelector]![twcColorVariable] = `${h} ${s}% ${l}%`;
         // if an alpha value was provided in the color definition, store it in a css variable
         if (defaultAlphaValue) {
            resolved.utilities[cssSelector]![twcOpacityVariable] = defaultAlphaValue.toFixed(2);
         }
         // set the dynamic color in tailwind config theme.colors
         resolved.colors[colorName] = ({ opacityVariable, opacityValue }) => {
            // if the opacity is set  with a slash (e.g. bg-primary/90), use the provided value
            if (!isNaN(+opacityValue)) {
               return `hsl(var(${twcColorVariable}) / ${opacityValue})`;
            }
            // if no opacityValue was provided (=it is not parsable to number)
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

export const createThemes = (config: ConfigObject | ConfigFunction = {}) => {
   const resolved = resolveConfig(config);

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
