const { createThemes } = require('../dist/lib/index');
const tailwindColors = require('tailwindcss/colors');

/**
 * broken types
 * @type (typeof tailwindColors)['default']
 */
const colors = tailwindColors;

/** @type {import('tailwindcss').Config} */
module.exports = {
   content: ['./**/*.{js,ts,jsx,tsx,html}'],

   plugins: [
      createThemes(
         {
            t1: {
               c1: 'rgb(255 0 0)',
            },
            t2: {
               c1: 'rgb(0 0 255)',
            },
            t3: {
               c1: 'purple',
            },
         },
         {
            defaultTheme: 't3',
            strict: false,
            produceThemeVariant: (themeName) => `theme-${themeName}`,
         },
      ),
      createThemes(
         ({ light, dark }) => ({
            light: light({
               primary: {
                  DEFAULT: 'orange',
                  100: 'red',
                  200: 'blue',
                  nested: {
                     100: 'rgb(0 125 255)',
                     200: colors.green[700], // oklch
                  },
               },
               'with/slash': 'black',
            }),
            dark: dark({
               primary: {
                  DEFAULT: 'red',
                  100: 'lime',
                  200: 'pink',
                  nested: {
                     100: 'rgb(125 255 125)',
                     200: 'rgb(255 125 255)',
                  },
               },
               'with/slash': 'grey',
            }),
         }),
         {
            produceThemeVariant: (themeName) => `theme-${themeName}`,
         },
      ),
   ],
};
