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
            accent: '#7c3aed',
            primary: 'teal',
            'primary-content': 'white',
            'base-100': '#f3f3f3',
            'base-200': '#ffffff',
            'base-content': '#444',
            'base-content-emphasis': '#555',
         },
         dark: {
            accent: '#7c3aed',
            primary: 'gold',
            'primary-content': '#505050',
            'base-100': '#404040',
            'base-200': '#525252',
            'base-content': '#e4e4e4',
            'base-content-emphasis': '#f3f3f3',
         },
      }),
      require('@tailwindcss/line-clamp'),
   ],
};
