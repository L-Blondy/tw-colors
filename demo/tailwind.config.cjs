const { createThemes } = require('../dist/lib');

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
               c1: 'rgb(0 0 255 / 0.5)',
            },
            t3: {
               c1: 'purple',
            },
         },
         {
            defaultTheme: {
               light: 't2', // blueish
               dark: 't3', // purple
            },
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
                     100: 'rgb(0 0 255 / 0.5)',
                     200: 'rgb(255 0 0 / 0.5)',
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
                     100: 'rgb(0 255 0 / 0.5)',
                     200: 'rgb(255 0 255 / 0.5)',
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
