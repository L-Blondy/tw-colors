# Welcome to [tw-colors](https://github.com/L-Blondy/tw-colors)

The easiest & fastest way to add multiple color themes to Tailwind apps

## Why

To implement a dark theme using Tailwind's dark mode feature, it is necessary to manually add dark variant styles throughout the application, which can be a time-consuming and complex process.

This package allows you to easily add **multiple color themes** to your Tailwind app with just **one className**. This means you don't have to add variants everywhere, and your app will be more maintainable.

## Highlights

* 🚀 **No markup change required**,  no need to refactor your existing code.
* 📦 **Zero javascript** added to the bundle size, it's just some CSS!
* ✨ **All color formats** are supported, including HEX, RGB, HSL, and named colors
* 🤩 **Fine-grained theming** with variants
* 💫 **Full [Tailwind CSS Intellisense][tailwind-intellisense-url] support** 🔥🔥🔥
 

## The Gist

```bash
npm i -D tw-colors
```

Take an existing tailwind config and move the colors in the `createTheme` plugin, giving it a name (e.g. light).

*tailwind.config.js*
```diff
+  const { createThemes } = require('tw-colors');

   module.exports = {
      content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
      theme: {
         extends: {
-           colors: {
-              'primary': 'steelblue',
-              'secondary': 'darkblue',
-              'base-100': '#F3F3F3',
-           }
         },
      },
      plugins: [
+        createThemes({
+           light: { 
+              'primary': 'steelblue',
+              'secondary': 'darkblue',
+              'base-100': '#F3F3F3',
+           }
+        })
      ],
   };

```

Apply the `theme-light` class anywhere in your app. \
Alternatively you can use data attributes `data-theme="light"`

```diff
-  <html>
+  <html class='theme-light'>
      ...
      <div class='bg-base-100'>
         <h1 class='text-primary'>...</h1>
         <p class='text-secondary'>...</p>
      </div>
      ...
   </html>
```

That's it, you site has a light theme!

## Usage

### Add multiple themes

Inside the `createThemes` function, define multiple color themes that use the same color names.

*tailwind.config.js*
```diff
   const { createThemes } = require('tw-colors');

   module.exports = {
      content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
      plugins: [
         createThemes({
            light: { 
               'primary': 'steelblue',
               'secondary': 'darkblue',
               'base-100': '#F3F3F3',
            },
+           dark: { 
+              'primary': 'turquoise',
+              'secondary': 'tomato',
+              'base-100': '#4A4A4A',
+           },
+           forest: { 
+              'primary': '#2A9D8F',
+              'secondary': '#E9C46A',
+              'base-100': '#264653',
+           },
         })
      ],
   };
```

### Switching themes

Simply switch the className.

```diff
-  <html class='theme-light'>
+  <html class='theme-dark'>
      ...
   </html>
```

...or the *data-theme* attribute

```diff
-  <html data-theme='light'>
+  <html data-theme='dark'>
      ...
   </html>
```

## Advanced usage

###  Variants

Apply specific styles based on the current theme

```html
   <!-- change the font-family for the "dark" theme only -->
   <html class='... theme-dark:font-calibri'>
      ...
   </html>

   <!-- change the default font-weight for the "forest" theme only -->
   <html class='... theme-forest:font-medium'>
      ...
   </html>
```

### CSS color-scheme

`createThemes` also accepts a function that exposes the `light` and `dark` functions. \
To apply the `color-scheme` CSS property, simply wrap your themes with `light` or `dark`."

*tailwind.config.js*
```js
   const { createThemes } = require('tw-colors');

   module.exports = {
      // ...your tailwind config
      plugins: [
         createThemes(({ light, dark }) => ({
            'my-light-theme': light({ 
               'primary': 'steelblue',
               'secondary': 'darkblue',
               'base-100': '#F3F3F3',
            }),
            'my-dark-theme': dark({ 
               'primary': 'turquoise',
               'secondary': 'tomato',
               'base-100': '#4A4A4A',
            }),
         }))
      ],
   };
```

See the [MDN docs][mdn-color-scheme] for more details on this feature.

### Nested themes

```diff
   <html class='theme-dark'>
      ...
      <div class='theme-light'>
         ...
      </div>

      <div class='theme-forest'>
         ...
      </div>
   </html>
```

<div align="center">

Please share

[![][tweet]][tweet-url]

</div >

[tweet]: https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Fgithub.com%2Fsaadeghi%2Fdaisyui
[tweet-url]: https://twitter.com/intent/tweet?text=tw-colors%0ATailwind%20color%20themes%20made%20easy!%0Ahttps://github.com/L-Blondy/tw-colors
[tailwind-intellisense-url]: https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss
[mdn-color-scheme]: https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme
<!-- https://github.com/L-Blondy/tw-colors/blob/master/README.md -->