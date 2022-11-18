/* cSpell:disable */
const createThemes = require('../src/index.js');
const themes = require('./src/themes.json');

/** @type {import('tailwindcss').Config} */
module.exports = {
   content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
   theme: {
      container: {
         center: true,
         padding: '20px',
      },
      fontFamily: {
         sans: ['Cabin', 'ui-sans-serif', 'system-ui', 'sans-serif'],
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
   plugins: [createThemes(themes)],
};
