/* cSpell:disable */
const createThemes = require('../src/index.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
   content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
   theme: {
      fontFamily: {
         sans: ['system-ui', 'sans-serif'],
         mono: [
            '"Red Hat Mono"',
            'Menlo',
            'Monaco',
            '"Lucida Console"',
            '"Liberation Mono"',
            '"DejaVu Sans Mono"',
            '"Bitstream Vera Sans Mono"',
            '"Courier New"',
            'monospace',
         ],
      },
   },
   plugins: [
      createThemes({
         light: {
            primary: 'teal',
            'primary-content': 'white',
            'base-100': '#eeeeee',
            'base-200': '#f3f3f3',
            'base-content': '#555',
            'base-content-emphasis': '#444',
         },
         dark: {
            primary: 'gold',
            'primary-content': '#505050',
            'base-100': '#404040',
            'base-200': '#525252',
            'base-content': '#e4e4e4',
            'base-content-emphasis': '#f3f3f3',
         },
         forest: {
            primary: 'hsl(162 29% 70%)',
            'primary-content': '#505050',
            'base-100': 'hsl(162 22% 45%)',
            'base-200': 'hsl(162 22% 59%)',
            'base-content': '#444',
            'base-content-emphasis': '#333',
         },
         salmon: {
            primary: '#bb2e2e',
            'primary-content': 'white',
            'base-100': 'hsl(18 70% 82%)',
            'base-200': 'hsl(13 90% 73%)',
            'base-content': '#444',
            'base-content-emphasis': '#333',
         },
      }),
      require('@tailwindcss/line-clamp'),
   ],
};
