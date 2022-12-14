# Welcome to [tw-colors](https://github.com/L-Blondy/tw-colors)

The easiest & fastest way to add multiple color themes to Tailwind apps

## Why

**Problem:**
Tailwind's dark is impractical. Forget a "dark" variant somewhere and the styles are broken

Rather than having to add variants everywhere, the goal is to provide **multiple color themes** to any tailwind app **with just one className**

## Highlights

* 🚀 **No markup change required**, no need to refactor!
* 📦 **Zero impact** on the bundle size, it's just some CSS!
* ✨ **All color formats** are supported (HEX, rgb, hsl, color names...)
* 🤩 **Nested themes** support
* 💫 **Full [Tailwind CSS Intellisense][tailwind-intellisense-url] support** 🔥🔥🔥
 

## The Gist

Take an existing *tailwind.config.js* colors config and move it inside of `createTheme` and give it a name (e.g. `light`)

*tailwind.config.js*
```diff
+  const { createThemes } = require('tw-colors');

   module.exports = {
      content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
      theme: {
         extends: {
-           colors: {
-              primary: 'steelblue',
-              secondary: 'darkblue',
-              'base-100': '#F3F3F3',
-           }
         },
      },
      plugins: [
+        createThemes({
+           light: { 
+              primary: 'steelblue',
+              secondary: 'darkblue',
+              'base-100': '#F3F3F3',
+           }
+        })
      ],
   };

```

Apply the generated **theme-[name]** class anywhere in your app

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

## Using multiple themes

*tailwind.config.js*
```diff
   const { createThemes } = require('tw-colors');

   module.exports = {
      content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
      plugins: [
         createThemes({
            light: { 
               primary: 'steelblue',
               secondary: 'darkblue',
               'base-100': '#F3F3F3',
            },
+           dark: { 
+              primary: 'turquoise',
+              secondary: 'tomato',
+              'base-100': '#4A4A4A',
+           },
+           forest: { 
+              primary: '#2A9D8F',
+              secondary: '#E9C46A',
+              'base-100': '#264653',
+           },
         })
      ],
   };
```

### Change themes dynamically

```diff
-  <html class='theme-light'>
+  <html class='theme-dark'>
      ...
   </html>
```

```diff
-  <html class='theme-dark'>
+  <html class='theme-forest'>
      ...
   </html>
```

### Nest the themes

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

### Use data attributes 

```diff
   <html data-theme='dark'>
      ...

      <div data-theme='light'>
         ...
      </div>

      <div data-theme='forest'>
         ...
      </div>
   </html>
```

## 📀 Install now!

## ✨ Demo

<div align="center">

Please share

[![][tweet]][tweet-url]

</div >

[tweet]: https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Fgithub.com%2Fsaadeghi%2Fdaisyui
[tweet-url]: https://twitter.com/intent/tweet?text=tw-colors%0ATailwind%20color%20themes%20made%20easy!%0AURL_TO_GITHUB
[daisyui-url]: https://daisyui.com/
[tailwind-intellisense-url]: https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss
