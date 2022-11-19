const Color = require('color');
const plugin = require('tailwindcss/plugin');
const forEach = require('lodash.foreach');

const SCHEME = Symbol('color-scheme');
const VAR_PREFIX = 'twc';
const RULE_PREFIX = '.twc-rule';

function dark(colors) {
   return {
      [SCHEME]: 'dark',
      ...colors,
   };
}

function light(colors) {
   return {
      [SCHEME]: 'light',
      ...colors,
   };
}

function toHslContent(color) {
   const [h, s, l] = Color(color).hsl().round().array();
   return `${h} ${s}% ${l}%`;
}

module.exports = {
   createThemes: (config = {}) => {
      const resolved = { utilities: {}, colors: {} };
      const configObject = typeof config === 'function' ? config({ dark, light }) : config;

      forEach(configObject, (colors, themeName) => {
         const cssSelector = `${RULE_PREFIX},.theme-${themeName},[data-theme="${themeName}"]`;

         resolved.utilities[cssSelector] = {
            'color-scheme': colors[SCHEME] || 'initial',
         };

         forEach(colors, (colorValue, colorName) => {
            // this case was handled above
            if (colorName === SCHEME) return;
            // set the css variable in "@layer utilities"
            resolved.utilities[cssSelector][`--${VAR_PREFIX}-${colorName}`] =
               toHslContent(colorValue);
            // set the dynamic color in tailwind config theme.colors
            resolved.colors[colorName] = `hsl(var(--${VAR_PREFIX}-${colorName}) / <alpha-value>)`;
         });
      });

      return plugin(
         // add the css variables to "@layer utilities"
         ({ addUtilities }) => {
            addUtilities(resolved.utilities);
         },
         // extend the colors config
         { theme: { extend: { colors: resolved.colors } } },
      );
   },
};
